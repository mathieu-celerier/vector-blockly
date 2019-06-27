import anki_vector
import time
from anki_vector.util import degrees

def main():
    with anki_vector.AsyncRobot("00a10a53", show_viewer=True) as robot:
        print("Driving off the charger")
        off_charger_future = robot.behavior.drive_off_charger()
        off_charger_future.result()

        while robot.world.connected_light_cube == None:
            print("Connecting to the cube")
            connect_future = robot.world.connect_cube()
            print(connect_future.result())
            print(robot.world.connected_light_cube.is_visible)

        print("Looking for the cube")
        robot.behavior.set_head_angle(degrees(0))

        '''
        while not robot.world.connected_light_cube.is_visible:
            print(robot.world.connected_light_cube.is_visible)
            robot.motors.set_wheel_motors(10,-10)
            time.sleep(0.2)

        print("Cube found")
        robot.motors.set_wheel_motors(0,0)

        time.sleep(4)

        print(robot.world.connected_light_cube)
        print("Rolling the cube")
        roll_future = robot.behavior.roll_cube(robot.world.connected_light_cube)
        print(roll_future)
        print(roll_future.result())
        '''

        i = 0;
        while not robot.world.connected_light_cube.is_visible:
            print(robot.world.connected_light_cube.is_visible)
            turn_future = robot.behavior.turn_in_place(degrees(-15))
            turn_future.result()
            time.sleep(1)
            if(i > 36):
                break
            i = i + 1

        if(i <= 36):
            print("Cube found")

            print("Rolling the cube")
            roll_future = robot.behavior.roll_cube(robot.world.connected_light_cube)
            roll_future.result()
        else:
            print("Cube not found")


        print("Disconnecting from the cube")
        disconnect_future = robot.world.disconnect_cube()
        disconnect_future.result()

        print("Driving back to the charger")
        on_charger_future = robot.behavior.drive_on_charger()
        on_charger_future.result()

if __name__ == "__main__":
    main()
