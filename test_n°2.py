import anki_vector
from anki_vector.util import degrees, distance_mm, speed_mmps
import time

with anki_vector.Robot("00a10a53") as robot:
    for anim in robot.anim.anim_list:
        if 'anim_slowbump_getout' in anim:
            print(anim)
