"use strict";


var vectorsBlocks =
[{
  "type": "connection",
  "message0": "%1 Connect to  %2 robot %3 Then do %4",
  "args0": [
    {
      "type": "field_image",
      "src": "https://image.flaticon.com/icons/svg/1464/1464665.svg",
      "width": 24,
      "height": 24,
      "alt": "GO",
      "flipRtl": false
    },
    {
      "type": "field_colour",
      "name": "COLOUR",
      "colour": "#cc00cc"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "main"
    }
  ],
  "colour": "#00E183",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "go_forward",
  "message0": "Go forward for %1 cm",
  "args0": [
    {
      "type": "field_input",
      "name": "distance_cm",
      "text": "10"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
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
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "leave_charger",
  "message0": "%1 Leave the charger",
  "args0": [
    {
      "type": "field_image",
      "src": "https://image.flaticon.com/icons/svg/149/149245.svg",
      "width": 24,
      "height": 24,
      "alt": "Battery",
      "flipRtl": false
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},

{
  "type": "go_to_charger",
  "message0": "%1 Return to the charger",
  "args0": [
    {
      "type": "field_image",
      "src": "https://image.flaticon.com/icons/svg/149/149245.svg",
      "width": 24,
      "height": 24,
      "alt": "Battery",
      "flipRtl": false
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "say",
  "message0": "%1 Say out loud :  %2",
  "args0": [
    {
      "type": "field_image",
      "src": "https://image.flaticon.com/icons/svg/149/149136.svg",
      "width": 24,
      "height": 24,
      "alt": "GO",
      "flipRtl": false
    },
    {
      "type": "field_input",
      "name": "TEXT",
      "text": "I love robots"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF802C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "lift",
  "message0": "Move arms %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "POS",
      "options": [
        [
          "up",
          "T"
        ],
        [
          "down",
          "B"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "turn",
  "message0": "Turn %1 in place",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "ORIENTATION",
      "options": [
        [
          "left",
          "LEFT"
        ],
        [
          "right",
          "RIGHT"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "turn_angle",
  "message0": "Turn %1 %2 in place",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "ANGLE",
      "options": [
        [
          "45°",
          "45"
        ],
        [
          "90°",
          "90"
        ],
        [
          "135°",
          "135"
        ],
        [
          "180°",
          "180"
        ]
      ]
    },
    {
      "type": "field_dropdown",
      "name": "ORIENTATION",
      "options": [
        [
          "left",
          "LEFT"
        ],
        [
          "right",
          "RIGHT"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "move_head",
  "message0": "Look  %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "POSITION",
      "options": [
        [
          "up",
          "UP"
        ],
        [
          "straight",
          "STRAIGHT"
        ],
        [
          "down",
          "DOWN"
        ]
      ]
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00C0F0",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "until_loop",
  "message0": "Repeat until %1 :",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION"
    }
  ],
  "message1": "Do %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "while_loop",
  "message0": "Repeat while %1 :",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION"
    }
  ],
  "message1": "Do %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wall_in_front",
  "message0": "There is a %1 %2 cm in front",
  "args0": [
    {
      "type": "field_image",
      "src": "https://image.flaticon.com/icons/svg/248/248196.svg",
      "width": 24,
      "height": 24,
      "alt": "wall",
      "flipRtl": false
    },
    {
      "type": "field_number",
      "name": "THRESHOLD",
      "value": 10,
      "min": 0,
      "max": 40,
      "precision": 1
    }
  ],
  "output": null,
  "colour": "#5DA5CB",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "is_touched",
  "message0": "Vector's back touched",
  "output": null,
  "colour": "#5DA5CB",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "set_speed",
  "message0": "Set %1 speed %2 %%",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "WHEEL",
      "options": [
        [
          "wheels",
          "BOTH"
        ],
        [
          "left wheel",
          "LEFT"
        ],
        [
          "right heel",
          "RIGHT"
        ]
      ]
    },
    {
      "type": "field_number",
      "name": "SPEED",
      "value": 0,
      "min": 0,
      "max": 100,
      "precision": 2
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#00BEA9",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "break_type",
  "message0": "Leave loop",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "if_type",
  "message0": "if %1 :",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION"
    }
  ],
  "message1": "Do %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "not_type",
  "message0": "not %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION"
    }
  ],
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wait_sleep",
  "message0": "Wait %1 s",
  "args0": [
    {
      "type": "field_number",
      "name": "TIME",
      "value": 0,
      "min": 0,
      "max": 30,
      "precision": 1
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "find_cube",
  "message0": "Turn in place to find the cube %1 if found %2 %3 else %4 %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "FOUND"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "NOT_FOUND"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "roll_cube",
  "message0": "Roll the cube in front",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "pick_cube",
  "message0": "Pick the cube in front",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "dock_cube",
  "message0": "Dock with the cube in front",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "place_cube",
  "message0": "Put the cube on the floor",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "pop_a_wheelie",
  "message0": "Make the robot pop a wheelie",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF95A8",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "wait_for",
  "message0": "wait for : %1",
  "args0": [
    {
      "type": "input_value",
      "name": "CONDITION"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#EEC71C",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "placeholder",
  "message0": "ADD BLOCKS UNDER %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "CODE"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#a0a0a0",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "come_here",
  "message0": "Come here",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#8F2BDD",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "fear",
  "message0": "Feared/Startled",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#8F2BDD",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "sulk",
  "message0": "Sulking",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#8F2BDD",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "attack",
  "message0": "Attack",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#8F2BDD",
  "tooltip": "",
  "helpUrl": ""
},
{
  "type": "laugh",
  "message0": "Laugh",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#8F2BDD",
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
