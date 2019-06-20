'use strict';

var robots = {'P':'00a10a53','B':'00804782','G':'00703fd8','Y':'009041bc'}
var height = {'T':'1.00','B':'0.00'};
var position = {'T':'UP','B':'DOWN'}

goog.require('Blockly.Python');

Blockly.Python['connection'] = function(block) {
  var dropdown_colour = block.getFieldValue('COLOUR');
  var checkbox_cam_on = block.getFieldValue('CAM_ON') == 'TRUE';
  var statements_main = Blockly.Python.statementToCode(block, 'main');
  var code = 'import anki_vector\n';
  code = code + 'import asyncio\n';
  code = code + 'from anki_vector.util import degrees, distance_mm, speed_mmps\n\n'
  code = code + 'def main():\n';
  code = code + '\twith anki_vector.AsyncRobot("'+robots[dropdown_colour]+'", enable_face_detection=True) as robot:\n';
  /*code = code + indent('  app.vector = VectorRobot(robot)',2)+'\n';
  if(checkbox_cam_on) {
    code = code + indent('  robot.camera.init_camera_feed()',2)+'\n';
    $('#imagefeed').addClass('stream');
  } else {
    $('#imagefeed').removeClass('stream');
  }*/
  code = code + indent(statements_main,2)+'\n';
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
  var code = '\nprint("Saying '+text_text+'")\n';
  code = code + 'robot.behavior.say_text("'+text_text+'")\n\n'
  return code;
};

Blockly.Python['lift'] = function(block) {
  var dropdown_name = block.getFieldValue('POS');
  var code = 'print("Lifting '+position[dropdown_name]+'")\n';
  code = code + 'lift_future = robot.behavior.set_lift_height('+height[dropdown_name]+')\n';
  code = code + 'lift_future.result()\n';
  return code;
};

function indent(str, numOfIndents, opt_spacesPerIndent) {
  str = str.replace(/^(?=.)/gm, new Array(numOfIndents + 1).join('\t'));
  numOfIndents = new Array(opt_spacesPerIndent + 1 || 0).join(' '); // re-use
  return opt_spacesPerIndent
    ? str.replace(/^\t+/g, function(tabs) {
        return tabs.replace(/./g, numOfIndents).slice(2);
    })
    : str;
}
