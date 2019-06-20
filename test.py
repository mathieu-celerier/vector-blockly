import anki_vector
import time

def main():
    robot = anki_vector.AsyncRobot("009041bc", enable_face_detection=True)
    robot.connect()
    robot.camera.init_camera_feed()
    image = robot.camera.latest_image
    image = image.annotate_image()
    image.show()
    robot.camera.close_camera_feed()
    robot.disconnect()


if __name__ == "__main__":
    main()
