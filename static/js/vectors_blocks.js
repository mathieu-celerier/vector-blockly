"use strict";


var vectorsBlocks =
[{
  "type": "connection",
  "message0": "Connect to  %1 robot, with camera %2 %3 %4",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "COLOUR",
      "options": [
        [
          "purple",
          "P"
        ],
        [
          "blue",
          "B"
        ],
        [
          "green",
          "G"
        ],
        [
          "yellow",
          "Y"
        ]
      ]
    },
    {
      "type": "field_checkbox",
      "name": "CAM_ON",
      "checked": false
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "main"
    }
  ],
  "colour": 60,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "go_forward",
  "message0": "go forward for %1 cm",
  "args0": [
    {
      "type": "field_input",
      "name": "distance_cm",
      "text": "10"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "make_a_turn",
  "message0": "Make %1 turn in place",
  "args0": [
    {
      "type": "field_number",
      "name": "nbr_turn",
      "value": 1,
      "min": 0,
      "precision": 1
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "leave_charger",
  "message0": "leave the charger",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 300,
  "tooltip": "",
  "helpUrl": ""
},


{
  "type": "go_to_charger",
  "message0": "return to the charger",
  "previousStatement": null,
  "nextStatement": null,
  "colour": 300,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "say",
  "message0": "Say out loud :  %1",
  "args0": [
    {
      "type": "field_input",
      "name": "TEXT",
      "text": "I love robots"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "lift",
  "message0": "Lift : %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "POS",
      "options": [
        [
          "Up",
          "T"
        ],
        [
          "Down",
          "B"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}];

for (var iBlock in vectorsBlocks) {
  function makeBlock(json) {
    Blockly.Blocks[json.type] = {
      init: function() {
        this.jsonInit(json);
      }
    }
  }
  makeBlock(vectorsBlocks[iBlock]);
}
