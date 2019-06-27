// Copyright 2019 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A lite polyfill of the ReadableStream native API with a subset
 * of methods supported.
 */
goog.module('goog.streams.lite');

const NativeResolver = goog.require('goog.promise.NativeResolver');
const {assert, assertFunction} = goog.require('goog.asserts');

/**
 * The underlying source for a lite ReadableStream.
 * @template T
 * @record
 */
class ReadableStreamUnderlyingSource {
  constructor() {
    /**
     * A start method that is called when the ReadableStream is constructed.
     *
     * For the purpose of the lite version, this method is not optional,
     * and the return value is not used. In other versions, a Promise return
     * value will prevent calls to pull until the Promise is resolved.
     * @type {(function(!ReadableStreamDefaultController<T>):
     *     (!Promise<undefined>|undefined))|undefined}
     */
    this.start;
  }
}

/**
 * The lite implemenation of ReadableStream.
 *
 * Supports the getReader() method and locked property.
 *
 * The only method of underlying sources that is supported is enqueueing,
 * closing, and erroring.
 *
 * Pulling (including backpressure and sizes) and cancellation are not
 * supported.
 * @template T
 */
class ReadableStream {
  /**
   * @param {!ReadableStreamUnderlyingSource} underlyingSource
   * @package
   */
  constructor(underlyingSource) {
    /** @package {!ReadableStream.State} */
    this.state = ReadableStream.State.READABLE;

    /**  @package {!ReadableStreamDefaultReader|undefined} */
    this.reader = undefined;

    /** @type {*|undefined} */
    this.storedError = undefined;

    /**
     * @type {function(!ReadableStreamDefaultController):
     *     (!Promise<undefined>|undefined)}
     */
    const startAlgorithm = (controller) => underlyingSource.start(controller);

    /** @package @const {!ReadableStreamDefaultController} */
    this.readableStreamController =
        new ReadableStreamDefaultController(this, startAlgorithm);
  }

  /**
   * Returns true if the ReadableStream has been locked to a reader.
   * https://streams.spec.whatwg.org/#rs-locked
   * @return {boolean}
   */
  get locked() {
    return this.reader !== undefined;
  }

  /**
   * Returns a ReadableStreamDefaultReader that enables reading chunks from
   * the source.
   * https://streams.spec.whatwg.org/#rs-get-reader
   * @return {!ReadableStreamDefaultReader<T>}
   */
  getReader() {
    return this.reader = this.acquireDefaultReader();
  }

  /**
   * @return {!ReadableStreamDefaultReader<T>}
   * @package
   */
  acquireDefaultReader() {
    return new ReadableStreamDefaultReader(this);
  }

  /**
   * @return {!Promise<!IIterableResult<T>>}
   * @package
   */
  addReadRequest() {
    const request = new NativeResolver();
    this.reader.readRequests.push(request);
    return request.promise;
  }

  /** @package */
  close() {
    this.state = ReadableStream.State.CLOSED;
    if (!this.reader) {
      return;
    }
    for (const readRequest of this.reader.readRequests) {
      readRequest.resolve({value: undefined, done: true});
    }
    this.reader.readRequests = [];
    this.reader.closedResolver.resolve();
  }

  /**
   * @param {*} e
   * @package
   */
  error(e) {
    this.state = ReadableStream.State.ERRORED;
    this.storedError = e;
    if (!this.reader) {
      return;
    }
    for (const readRequest of this.reader.readRequests) {
      readRequest.reject(e);
    }
    this.reader.readRequests = [];
    this.reader.closedResolver.promise.catch(() => {});
    this.reader.closedResolver.reject(e);
  }

  /**
   * @param {T} chunk
   * @param {boolean} done
   * @package
   */
  fulfillReadRequest(chunk, done) {
    const readRequest = assert(this.reader).readRequests.shift();
    readRequest.resolve({value: chunk, done});
  }

  /**
   * @return {number}
   * @package
   */
  getNumReadRequests() {
    return assert(this.reader).readRequests.length;
  }

  /**
   * @return {boolean}
   * @package
   */
  hasDefaultReader() {
    return this.reader !== undefined;
  }
}

/** @package @enum {number} */
ReadableStream.State = {
  READABLE: 1,
  CLOSED: 2,
  ERRORED: 3,
};

/**
 * Creates and returns a new ReadableStream.
 *
 * The underlying source should only have a start() method, and no other
 * properties.
 * @param {!ReadableStreamUnderlyingSource<T>} underlyingSource
 * @return {!ReadableStream<T>}
 * @suppress {strictMissingProperties}
 * @template T
 */
function newReadableStream(underlyingSource) {
  assertFunction(
      underlyingSource.start,
      `'start' property must be a function on an underlying source for a ` +
          'lite ReadableStream');
  const verifyObject =
      /** @type {!Object} */ (underlyingSource);
  assert(
      !(verifyObject.pull),
      `'pull' property not allowed on an underlying source for a ` +
          'lite ReadableStream');
  assert(
      !(verifyObject.cancel),
      `'cancel' property not allowed on an underlying source for a ` +
          'lite ReadableStream');
  assert(
      !(verifyObject.type),
      `'type' property not allowed on an underlying source for a ` +
          'lite ReadableStream');
  assert(
      !(verifyObject.autoAllocateChunkSize),
      `'autoAllocateChunkSize' property not allowed on an underlying ` +
          'source for a lite ReadableStream');
  return new ReadableStream(underlyingSource);
}

/**
 * A reader for a lite ReadableStream.
 *
 * Supports the read() and releaseLock() methods, along with the closed
 * property.
 * @template T
 */
class ReadableStreamDefaultReader {
  /**
   * @param {!ReadableStream} stream
   * @package
   */
  constructor(stream) {
    if (stream.reader) {
      throw new TypeError(
          'ReadableStreamReader constructor can only accept readable streams ' +
          'that are not yet locked to a reader');
    }
    /** @package {!ReadableStream|undefined} */
    this.ownerReadableStream = stream;

    /** @package {!NativeResolver<undefined>} */
    this.closedResolver = new NativeResolver();

    /** @package {!Array<!NativeResolver<!IIterableResult<T>>>} */
    this.readRequests = [];

    if (stream.state === ReadableStream.State.CLOSED) {
      this.closedResolver.resolve();
    } else if (stream.state === ReadableStream.State.ERRORED) {
      this.closedResolver.promise.catch(() => {});
      this.closedResolver.reject(stream.storedError);
    }
  }

  /**
   * Returns a Promise that resolves when the Stream closes or is errored, or if
   * the reader releases its lock.
   * @return {!Promise<undefined>}
   */
  get closed() {
    return this.closedResolver.promise;
  }

  /**
   * Returns a Promise that resolves with an IIterableResult providing the next
   * chunk or that the stream is closed. The Promise may reject if the stream
   * is errored.
   * @return {!Promise<!IIterableResult<T>>}
   */
  read() {
    if (!this.ownerReadableStream) {
      throw new TypeError(
          'This readable stream reader has been released and cannot be used ' +
          'to read from its previous owner stream');
    }
    return this.readInternal();
  }

  /**
   * Release the lock on the stream. Any further calls to read() will error,
   * and the stream can create another reader.
   * @return {void}
   */
  releaseLock() {
    if (!this.ownerReadableStream) {
      return;
    }
    if (this.readRequests.length) {
      throw new TypeError(
          'Cannot release a readable stream reader when it still has ' +
          'outstanding read() calls that have not yet settled');
    }
    this.release();
  }

  /** @package */
  release() {
    const stream = assert(this.ownerReadableStream);
    const e = new TypeError(
        'This readable stream reader has been released and cannot be used ' +
        `to monitor the stream's state`);
    if (stream.state === ReadableStream.State.READABLE) {
      this.closedResolver.promise.catch(() => {});
      this.closedResolver.reject(e);
    } else {
      this.closedResolver = new NativeResolver();
      this.closedResolver.promise.catch(() => {});
      this.closedResolver.reject(e);
    }
    stream.reader = undefined;
    this.ownerReadableStream = undefined;
  }

  /**
   * @return {!Promise<!IIterableResult<T>>}
   * @package
   */
  readInternal() {
    const stream = assert(this.ownerReadableStream);
    if (stream.state === ReadableStream.State.CLOSED) {
      return Promise.resolve({value: undefined, done: true});
    }
    if (stream.state === ReadableStream.State.ERRORED) {
      return Promise.reject(stream.storedError);
    }
    return stream.readableStreamController.pullSteps();
  }
}

/**
 * A controller for a lite ReadableStream.
 *
 * Provides the enqueue(), error(), and close() methods.
 * @template T
 */
class ReadableStreamDefaultController {
  /**
   * @param {!ReadableStream} stream
   * @param {function(!ReadableStreamDefaultController):
   *     (!Promise<undefined>|undefined)} startAlgorithm
   * @package
   */
  constructor(stream, startAlgorithm) {
    /** @package @const {!ReadableStream} */
    this.controlledReadableStream = stream;

    /** @package @const {!Queue} */
    this.queue = new Queue();

    /** @package {boolean} */
    this.closeRequested = false;

    Promise.resolve(startAlgorithm(this))
        .then(
            () => {
              this.start();
            },
            (e) => {
              this.errorInternal(e);
            });
  }

  /**
   * Signals that the ReadableStream should close. The ReadableStream will
   * actually close once all of its chunks have been read.
   * @return {void}
   */
  close() {
    if (!this.canCloseOrEnqueue()) {
      throw new TypeError(
          'Cannot close a readable stream that has already been requested to ' +
          'be closed');
    }
    this.closeInternal();
  }

  /**
   * Enqueues a new chunk into the stream that can be read.
   * @param {T} chunk
   * @return {*}
   */
  enqueue(chunk) {
    if (!this.canCloseOrEnqueue()) {
      throw new TypeError(
          'Cannot enqueue a readable stream that has already been requested ' +
          'to be closed');
    }
    return this.enqueueInternal(chunk);
  }

  /**
   * Closes the stream with an error. Any future interactions with the
   * controller will throw an error.
   * @param {*} e
   */
  error(e) {
    this.errorInternal(e);
  }

  /**
   * @param {*} reason
   * @package
   */
  cancelSteps(reason) {}

  /**
   * @return {!Promise<!IIterableResult<T>>}
   * @package
   */
  pullSteps() {
    if (!this.queue.empty()) {
      const chunk = this.queue.dequeueValue();
      if (this.closeRequested && this.queue.empty()) {
        this.clearAlgorithms();
        this.controlledReadableStream.close();
      } else {
        this.callPullIfNeeded();
      }
      return Promise.resolve({value: chunk, done: false});
    }
    const promise = this.controlledReadableStream.addReadRequest();
    this.callPullIfNeeded();
    return promise;
  }

  /** @package */
  start() {}

  /** @package */
  callPullIfNeeded() {}

  /** @package */
  shouldCallPull() {}

  /** @package */
  clearAlgorithms() {}

  /**
   * @package
   */
  closeInternal() {
    this.closeRequested = true;
    if (this.queue.empty()) {
      this.clearAlgorithms();
      this.controlledReadableStream.close();
    }
  }

  /**
   * @param {T} chunk
   * @return {*}
   * @package
   */
  enqueueInternal(chunk) {
    if (this.controlledReadableStream.locked &&
        this.controlledReadableStream.getNumReadRequests() > 0) {
      this.controlledReadableStream.fulfillReadRequest(
          chunk, /* done= */ false);
      return;
    }
    return this.enqueueIntoQueue(chunk);
  }

  /**
   * @param {T} chunk
   * @return {*}
   * @protected
   */
  enqueueIntoQueue(chunk) {
    return this.queue.enqueueValue(chunk);
  }

  /**
   * @param {*} e
   * @package
   */
  errorInternal(e) {
    if (this.controlledReadableStream.state !== ReadableStream.State.READABLE) {
      return;
    }
    this.queue.resetQueue();
    this.clearAlgorithms();
    this.controlledReadableStream.error(e);
  }

  /**
   * @return {boolean}
   * @package
   */
  canCloseOrEnqueue() {
    return !this.closeRequested &&
        this.controlledReadableStream.state === ReadableStream.State.READABLE;
  }
}

/**
 * An internal Queue representation. This simple Queue just wraps an Array.
 * Other implementations may also have a size associated with each element.
 * @template T
 */
class Queue {
  constructor() {
    /** @private {!Array<T>} */
    this.queue_ = [];
  }

  /**
   * @return {boolean}
   */
  empty() {
    return this.queue_.length === 0;
  }

  /**
   * @return {T}
   */
  dequeueValue() {
    return this.queue_.shift();
  }

  /**
   * @param {T} value
   * @return {*}
   */
  enqueueValue(value) {
    this.queue_.push(value);
  }

  /**
   * @return {void}
   */
  resetQueue() {
    this.queue_ = [];
  }
}

exports = {
  ReadableStream,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
  ReadableStreamUnderlyingSource,
  newReadableStream,
};
