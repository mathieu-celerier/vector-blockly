// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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

goog.module('goog.testing.ui.rendererassertsTest');
goog.setTestOnly();

const ControlRenderer = goog.require('goog.ui.ControlRenderer');
const TestCase = goog.require('goog.testing.TestCase');
const asserts = goog.require('goog.testing.asserts');
const rendererasserts = goog.require('goog.testing.ui.rendererasserts');
const testSuite = goog.require('goog.testing.testSuite');

testSuite({
  setUp() {
    // TODO(b/25875505): Fix unreported assertions (go/failonunreportedasserts).
    TestCase.getActiveTestCase().failOnUnreportedAsserts = false;
  },

  testSuccess() {
    function GoodRenderer() {}

    rendererasserts.assertNoGetCssClassCallsInConstructor(GoodRenderer);
  },

  testFailure() {
    function BadRenderer() {
      ControlRenderer.call(this);
      this.myClass = this.getCssClass();
    }
    goog.inherits(BadRenderer, ControlRenderer);

    const ex = assertThrows(
        'Expected assertNoGetCssClassCallsInConstructor to fail.', () => {
          rendererasserts.assertNoGetCssClassCallsInConstructor(BadRenderer);
        });
    assertTrue(
        'Expected assertNoGetCssClassCallsInConstructor to throw a' +
            ' jsunit exception',
        ex.isJsUnitException);
    assertContains('getCssClass', ex.message);
  },
});
