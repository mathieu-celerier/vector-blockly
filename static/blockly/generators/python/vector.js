'use strict';

var robots = {'#cc00cc':'00a10a53','#0000ff':'00804782','#008000':'00703fd8','#ffff00':'009041bc','#00ff00':'00504046'}
var height = {'T':'1.00','B':'0.00'};
var position = {'T':'UP','B':'DOWN'}

goog.require('Blockly.Python');

Blockly.Python['connection'] = function(block) {
  var colour = block.getFieldValue('COLOUR');
  var statements_main = Blockly.Python.statementToCode(block, 'main');
  var code = 'import anki_vector\n';
  code = code + 'import asyncio\n';
  code = code + 'from anki_vector.util import degrees, distance_mm, speed_mmps\n\n'
  code = code + 'def main():\n';
  code = code + '\twith anki_vector.AsyncRobot("'+robots[colour]+'", enable_face_detection=True) as robot:\n';
  /*code = code + indent('  app.vector = VectorRobot(robot)',2)+'\n';
  if(checkbox_cam_on) {
    code = code + indent('  robot.camera.init_camera_feed()',2)+'\n';
    $('#imagefeed').addClass('stream');
  } else {
    $('#imagefeed').removeClass('stream');
  }*/
  code = code + indent('    robot.motors.set_wheel_motors(0,0)\n',2)
  code = code + indent(statements_main,2)+'\n';
  code = code + indent('    robot.motors.set_wheel_motors(0,0)\n',2)
  code = code + 'if __name__ == "__main__":\n';
  code = code + '\tmain()'
  return code;
};

Blockly.Python['go_forward'] = function(block) {
  var text_distance_cm = block.getFieldValue('distance_cm');
  var code = 'print("Drive Vector straight")\n'
  code = code + 'drive_future = robot.behavior.drive_straight(distance_mm('+text_distance_cm+'*10), speed_mmps(50))\n'
  code = code + 'drive_future.result()\n'
  return code;
};

Blockly.Python['make_a_turn'] = function(block) {
  var text_nbr_turn = block.getFieldValue('nbr_turn');
  var code = 'print("Turn Vector in place")\n'
  code = code + 'turn_future = robot.behavior.turn_in_place(degrees('+text_nbr_turn+'*360))\n'
  code = code + 'turn_future.result()\n'
  return code;
};

Blockly.Python['leave_charger'] = function(block) {
  var code = 'print("Leaving the charger")\n'
  code = code + 'off_charger_future = robot.behavior.drive_off_charger()\n';
  code = code + 'off_charger_future.result()\n';
  return code;
};

Blockly.Python['go_to_charger'] = function(block) {
  var code = 'print("Going back to the charger")\n'
  code = code + 'on_charger_future = robot.behavior.drive_on_charger()\n';
  code = code + 'on_charger_future.result()\n';
  return code;
};

Blockly.Python['say'] = function(block) {
  var text_text = block.getFieldValue('TEXT');
  var code = 'print("Saying '+text_text+'")\n';
  code = code + 'robot.behavior.say_text("'+text_text+'")\n'
  return code;
};

Blockly.Python['lift'] = function(block) {
  var dropdown_name = block.getFieldValue('POS');
  var code = 'print("Lifting '+position[dropdown_name]+'")\n';
  code = code + 'lift_future = robot.behavior.set_lift_height('+height[dropdown_name]+')\n';
  code = code + 'lift_future.result()\n';
  return code;
};

Blockly.Python['turn'] = function(block) {
  var dropdown_orientation = block.getFieldValue('ORIENTATION');
  var code = 'print("Turn Vector ' + dropdown_orientation + '")\n';
  code = code + 'turn_future = robot.behavior.turn_in_place(degrees(';
  if(dropdown_orientation == "LEFT") {
    code = code + '1';
  } else {
    code = code + '-1';
  }
  code = code + '*90))\n'
  code = code + 'turn_future.result()\n'
  return code;
};

Blockly.Python['turn_angle'] = function(block) {
  var dropdown_angle = block.getFieldValue('ANGLE');
  var dropdown_orientation = block.getFieldValue('ORIENTATION');
  var code = 'print("Turn Vector '+ dropdown_angle +'° '+ dropdown_orientation +'")\n';
  code = code + 'turn_future = robot.behavior.turn_in_place(degrees(';
  if(dropdown_orientation == "LEFT") {
    code = code + '1';
  } else {
    code = code + '-1';
  }
  code = code + '*'+ dropdown_angle +'))\n'
  code = code + 'turn_future.result()\n'
  return code;
};

Blockly.Python['move_head'] = function(block) {
  var dropdown_name = block.getFieldValue('POSITION');
  var code = 'print("Look '+dropdown_name+'")\n';
  if(dropdown_name == "UP") {
    code = code + 'move_head_future = robot.behavior.set_head_angle(degrees(45))\n';
  } else if(dropdown_name == "STRAIGHT") {
    code = code + 'move_head_future = robot.behavior.set_head_hangle(degrees(0))\n';
  } else {
    code = code + 'move_head_future = robot.behavior.set_head_angle(degrees(-22))\n';
  }
  code = code + 'move_head_future.result()\n'
  return code;
};

Blockly.Python['while_loop'] = function(block) {
  var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC) || 'True';
  var statements_do = Blockly.Python.statementToCode(block, 'DO');

  statements_do = Blockly.Python.addLoopTrap(statements_do, block.id) || Blockly.Python.PASS;

  return 'while ' + value_condition + ':\n' + statements_do;
};

Blockly.Python['until_loop'] = function(block) {
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC) || 'True';
  var statements_do = Blockly.Python.statementToCode(block, 'DO');

  statements_do = Blockly.Python.addLoopTrap(statements_do, block.id) || Blockly.Python.PASS;

  return 'while not' + value_condition + ':\n' + statements_do;
};

Blockly.Python['wall_in_front'] = function(block) {
  var number_threshold = block.getFieldValue('THRESHOLD');
  var code = 'robot.proximity.last_sensor_reading.distance.distance_mm < ' + number_threshold*10;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['is_touched'] = function(block) {
  var code = 'robot.touch.last_sensor_reading.is_being_touched';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['set_speed'] = function(block) {
  var dropdown_wheel = block.getFieldValue('WHEEL');
  var number_speed = block.getFieldValue('SPEED');
  var code = 'print("Set '+dropdown_wheel+' wheel speed to '+number_speed+'%")\n';
  if (dropdown_wheel == "BOTH") {
    code = code + 'robot.motors.set_wheel_motors('+number_speed+','+number_speed+')\n'
  } else if (dropdown_wheel == "LEFT") {
    code = code + 'robot.motors.set_wheel_motors('+number_speed+', robot.right_wheel_speed_mmps)\n'
  } else {
    code = code + 'robot.motors.set_wheel_motors(robot.left_wheel_speed_mmps ,'+number_speed+')\n'
  }
  return code;
};

Blockly.Python['break_type'] = function(block) {
  var code = 'break\n';
  return code;
};

Blockly.Python['if_type'] = function(block) {
  var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC) || 'True';
  var statements_do = Blockly.Python.statementToCode(block, 'DO');

  statements_do = Blockly.Python.addLoopTrap(statements_do, block.id) ||
      Blockly.Python.PASS;

  return 'if ' + value_condition + ':\n' + statements_do;
};

Blockly.Python['not_type'] = function(block) {
  var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC);
  var code = 'not ' + value_condition;
  return code;
};

Blockly.Python['wait_sleep'] = function(block) {
  var number_time = block.getFieldValue('TIME');
  var code = 'time.sleep('+number_time+')\n';
  return code;
};

Blockly.Python['find_cube'] = function(block) {
  var statements_found = Blockly.Python.statementToCode(block, 'FOUND');
  var statements_not_found = Blockly.Python.statementToCode(block, 'NOT_FOUND');
  var code = connectToTheCube();
  code = code + 'print("Looking for the cube")\n';
  code = code + 'robot.behavior.set_head_angle(degrees(0))\n\n';
  code = code + 'i = 0\n';
  code = code + 'while not robot.world.connected_light_cube.is_visible:\n';
  code = code + '\tprint(robot.world.connected_light_cube.is_visible)\n';
  code = code + '\tturn_future = robot.behavior.turn_in_place(degrees(-15))\n';
  code = code + '\tturn_future.result()\n';
  code = code + '\ttime.sleep(1)\n';
  code = code + '\tif(i > 36):\n';
  code = code + '\t\tbreak\n';
  code = code + '\ti = i + 1\n\n';
  code = code + 'if(i <= 36):\n';
  code = code + indent('  print("Cube found")\n',1);
  code = code + indent(statements_found,1);
  code = code + 'else:\n';
  code = code + '\t  print("Cube not found")\n';
  code = code + indent(statements_not_found,1);
  code = code + '\nrobot.world.disconnect_cube()\n'
  return code;
};

Blockly.Python['roll_cube'] = function(block) {
  var code = 'print("Rolling the cube")\n'
  code = code + 'roll_future = robot.behavior.roll_cube(robot.world.connected_light_cube)\n'
  code = code + 'roll_future.result()\n'
  return code;
};

Blockly.Python['pick_cube'] = function(block) {
  var code = 'print("Picking the cube")\n'
  code = code + 'pickup_future = robot.behavior.pickup_object(robot.world.connected_light_cube, use_pre_dock_pose=False)\n'
  code = code + 'pickup_future.result()\n'
  return code;
};

Blockly.Python['dock_cube'] = function(block) {
  var code = 'print("Docking with the cube")\n'
  code = code + 'dock_future = robot.behavior.dock_with_cube(robot.world.connected_light_cube)\n'
  code = code + 'dock_future.result()\n'
  return code;
};

Blockly.Python['place_cube'] = function(block) {
  var code = 'print("Putting the cube on the floor")\n'
  code = code + 'place_future = robot.behavior.place_object_on_ground_here()\n'
  code = code + 'place_future.result()\n'
  return code;
};

Blockly.Python['pop_a_wheelie'] = function(block) {
  var code = 'print("Pop a wheelie")\n'
  code = code + 'place_future = robot.behavior.pop_a_wheelie(robot.world.connected_light_cube)\n'
  code = code + 'place_future.result()\n'
  return code;
};

Blockly.Python['wait_for'] = function(block) {
  var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC);
  var code = '\nwhile not ' + value_condition + ':\n';
  code = code + '\tpass\n\n';
  return code;
};

Blockly.Python['placeholder'] = function(block) {
  var statements_code = Blockly.Python.statementToCode(block, 'CODE');
  var code = '\n' + statements_code + '\n';
  return code;
};

Blockly.Python['come_here'] = function(block) {
  var code = 'robot.anim.play_animation_trigge("ComeHereSuccess")\n';
  return code;
};

Blockly.Python['fear'] = function(block) {
  var code = 'robot.anim.play_animation_trigge("CubePounceBackup")\n';
  return code;
};

Blockly.Python['sulk'] = function(block) {
  var code = 'robot.anim.play_animation_trigge("CubePounceLoseHand")\n';
  code = code + 'robot.anim.play_animation_trigge("CubePounceUnready")\n';
  return code;
};

Blockly.Python['attack'] = function(block) {
  var code = 'robot.anim.play_animation_trigge("CubePouncePounceNormal")\n';
  return code;
};

Blockly.Python['laugh'] = function(block) {
  var code = 'robot.anim.play_animation_trigge("CubePounceWinHand")\n';
  code = code + 'robot.anim.play_animation_trigge("CubePounceWinSession")\n';
  return code;
};

/* -------------------------------------------------------------------------- */

function indent(str, numOfIndents, opt_spacesPerIndent) {
  str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
  numOfIndents = new Array(opt_spacesPerIndent + 1 || 0).join(' '); // re-use
  return opt_spacesPerIndent
    ? str.replace(/^\t+/g, function(tabs) {
        return tabs.replace(/./g, numOfIndents).slice(2);
    })
    : str;
}

/* -------------------------- Functions for vector--------------------------- */

function connectToTheCube() {
  var code = '\nwhile robot.world.connected_light_cube == None:\n'
  code = code + indent('print("Connecting to the cube")\n',1)
  code = code + indent('connect_future = robot.world.connect_cube()\n',1)
  code = code + indent('connect_future.result()\n',1)
  return code;
}
