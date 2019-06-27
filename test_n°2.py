import anki_vector
from anki_vector.util import degrees, distance_mm, speed_mmps
import time

with anki_vector.AsyncRobot("00a10a53") as robot:
    while True:
        print("Connecting to the cube")
        robot.world.connect_cube()
        if robot.world.connected_light_cube:
            break
        time.sleep(1)

    print("Picking the cube")
    pick_future = robot.behavior.pickup_object(robot.world.connected_light_cube)
    pick_future.result()
    
    print("Put the cube down")
    place_future = robot.behavior.place_object_on_ground_here()
    place_future.result()
