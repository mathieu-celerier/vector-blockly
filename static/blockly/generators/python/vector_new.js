'use strict';

goog.require('Blockly.Python');

Blockly.Python['connection'] = function(block) {
  var text_serial = Blockly.Python.valueToCode(block, 'Serial', Blockly.Python.ORDER_ATOMIC);;
  var statements_main = Blockly.Python.statementToCode(block, 'main');
  var code = 'import anki_vector\n';
  code = code + 'import asyncio\n';
  code = code + 'from anki_vector.util import degrees, distance_mm, speed_mmps\n\n'
  code = code + 'def main():\n'
  code = code + '\twith anki_vector.AsyncRobot('+text_serial+', enable_face_detection=True) as robot:\n';
  code = code + indent(statements_main,2)+'\n';
  code = code + 'if __name__ == "__main__":\n';
  code = code + '\tmain()'
  return code;
};

Blockly.Python['go_forward'] = function(block) {
  var text_distance_mm = block.getFieldValue('distance_mm');
  var code = 'print("Drive Vector straight")\n'
  code = code + 'drive_future = robot.behavior.drive_straight(distance_mm('+text_distance_mm+'), speed_mmps(10))\n'
  code = code + 'drive_future.result()\n'
  return code;
};

Blockly.Python['make_a_turn'] = function(block) {
  var text_nbr_turn = block.getFieldValue('nbr_turn');
  var code = 'print("Turn Vector in place")\n'
  code = code + 'turn_future = robot.behavior.turn_in_place(degrees('+text+'*360))'
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
