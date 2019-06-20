import sys

from flask import Flask, render_template, request, redirect, Response
import random, json, time

app = Flask(__name__)

import anki_vector
from anki_vector import util
import asyncio
from anki_vector.util import degrees, distance_mm, speed_mmps
import cv2
from lib import flask_helpers
from io import BytesIO

ID = {'Purple':'00a10a53','Blue':'00804782','Green':'00703fd8','Yellow':'009041bc','Lime':'00504046'}
app.Robots = {}

class VectorRobot:
	def __init__(self,robot):
		self.vector = robot
		self.vector.connect()
		self.vector.camera.init_camera_feed()


def streaming_video(name):
	while True:
		if app.Robots[name].vector:
			if(app.Robots[name].vector.camera.image_streaming_enabled()):
				image = app.Robots[name].vector.camera.latest_image
				image = image.annotate_image()
				img_io = BytesIO()
				image.save(img_io, format='PNG')
				yield (b'--frame\r\n'
					   b'Content-Type: image/png\r\n\r\n' + img_io.getvalue() + b'\r\n')
				time.sleep(0.03)
			else:
				app.Robots[name].vector.camera.init_camera_feed()

@app.route('/')
def output():
	# serve index template
	return render_template('vector.html')

@app.route('/run', methods = ['POST'])
def script():
	input_string = request.form['data']
	code = compile(input_string,"<string>","exec");
	exec(code,globals())
	return "backend response"

@app.route('/reconnect', methods = ['POST'])
def reconnection():
	name = request.form['name']
	print(name)
	if name in app.Robots:
		print("Reconnecting to {} vector with serial : {}".format(name,ID[name]))
		app.Robots[name].vector.camera.close_camera_feed()
		app.Robots[name].vector.disconnect()
		del app.Robots[name]

	else:
		print("You haven't already connect to the robot\n")
	return "backend response"

@app.route('/video_feed/<name>')
def video_feed(name):
	print(name)
	if name in app.Robots:
		print("Connection already opened\n")
		return Response(streaming_video(name), mimetype='multipart/x-mixed-replace; boundary=frame')
	else:
		print("Connecting to {} vector with serial : {}".format(name,ID[name]))
		robot = anki_vector.AsyncRobot(ID[name],enable_face_detection=True)
		app.Robots[name] = VectorRobot(robot)
		app.Robots[name].vector.vision.enable_face_detection(detect_faces=True, detect_gaze=True)
		return Response(streaming_video(name), mimetype='multipart/x-mixed-replace; boundary=frame')

def run():
	args = util.parse_command_args()

	flask_helpers.run_flask(app,host_ip="0.0.0.0",host_port=5000,open_page=False)

if __name__ == '__main__':
	try:
		run()
	except KeyboardInterrupt as e:
		pass
	except anki_vector.exceptions.VectorConnectionException as e:
		sys.exit("A connection error occurred: %s" % e)
