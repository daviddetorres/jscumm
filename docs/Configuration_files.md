# JSCUMM: Configuration files and directories
For the JSCUMM engine to work properly, there are some configuration files that must me set up and that defines the general logic of the game. All of them are located under the 'chapter' directory.

## File: /chapter/config.json
Here is al example of this file:
```
{
    "first_scene": "0_tutorial_studio",
	 "total_number_flags": 3,
	 "text_images":{
		 "About ginger cookie:": "./chapter/items/galleta.jpg",
		 "About ginger cookies:": "./chapter/items/galleta.jpg",

		 "David:":"./chapter/characters/david.jpg",
		 "Luna:":"./chapter/characters/luna.jpg",
		 "Ceren:":"./chapter/characters/ceren.jpg",
		 
		 "About scratches:": "./chapter/characters/marcas_despensa.jpg"
	 }
}
```
- first_scene: It is the first scene of the game. Also will be the scene loaded when the game restart from the beginning.
- total_number_flags: It is used to calculate the % of the game completed while saving a game.
- text_images: If the first line of a ntxt command matches any of this entries, it will show the image configured. 

:sunglasses: PRO-TIP: You can use the text_image field to configure different images, for example:
```
...
"David:":"./chapter/characters/david.jpg",
"David: ":"./chapter/characters/david_angry.jpg",
"David:  ":"./chapter/characters/david_scared.jpg",
...
```
As you can see, at the end of the 'David:' there are 0, 1 or 2 blank spaces. They will not be seen by the player, but we can use it to define different images. So, if in the game you want the face of David to change according to the sentence he is saying, you just have to write a ntxt command like this:
```
...
{
    "com":"ntxt"
    "txt":[
        "David:#This will show a normal face",
        "David: #This will show an angry David",
        "David:  #This will make David scared"
    ]
}
...
```

:sunglasses: PRO-TIP: You can use the text_image field to highlight a finding or something important in the scene while looking at it. For example, this sentence will make that when talking about the scratches an image of the detail will be shown:
```
...
"About scratches:": "./chapter/characters/marcas_despensa.jpg"
...
```


## File: /chapter/actions.json
This file configures the possible actions that can be configured in the GUI and in the characters. An example can be:
```
[
	{ 
		"id": "look",
		"text": "Look at",
		"dative": false
	},
	{
		"id": "observe",
		"text": "Observe",
		"dative": false,
		"alternative": "look"
	},
	{
		"id": "take",
		"text": "Take",
		"dative": false
	},
	{
		"id": "talk",
		"text": "Talk to",
		"dative": false
	},
	{
		"id": "use",
		"text": "Use",
		"dative": false
	},
	{
		"id": "give",
		"text": "Give",
		"dative": true,
		"preposition": "to"
	},
	{
		"id": "mix",
		"text": "Mix/use",
		"dative": true,
		"preposition": "with"
	}
]
```
There are some interesting things in this file: 
- id: This will be the attribute name that will be used to locate the action in the items and characters.
- text: Will be the text shown in the GUI in the action text area (for example: "Give cookie to Luna").
- alternative: If this action is not defined in teh item/character, the engine will look if the alternative is defined. For example, if 'observe' is not defined, it will try 'look' instead. This is an easy way to save code and time.
- dative: There are actions that just require an object ("Take cookie"). But there are others that need something else: an indirect complement ("give cookie to Luna"). In this case, the attribute "dative" will be set as "true". The action will be defined in the second object (pe. "Luna"), and for each possible object, a list of actions will be defined.
- preposition: If the action is dative, there must be a preposition. In the case of "give" the preposition is "to", but in the case of "mix something WITH something-else" the preposition will be "with". 

:sunglasses: PRO-TIP: Both the characters and the items can have actions not defined in this file. It is used to defined internal functions only accessible by the goto command.

## File: /chapter/items.json
Here is a fragment of an example of this file:
```
[
	{
		"id": "1omartillo",
		"name": "small hammer",
		"image": "martillo.jpg",
		"actions": {
			"look": [
				{
					"com": "ntxt",
					"txt": [
						"#It's a small hammer."
					]
				}
			],
			"observe": [
				{
					"com": "ntxt",
					"txt": [
						"About small hammer:#It's an iron hammer. A little bit rusty, but useful for most of the maintenance of an usual English home."
					]
				}
			]
		}
	},
...
]
```
Basically, it is a list of items. Each item is defined by: 
- id: This is the ID that will match the item of the inventory of the player inside the game. This ID will be the same used to give and remove the item from the inventory with the commands +item and -item.
- name: This will be the text used in the GUI action text area (give small hammer to David).
- image: The image that will be seen in the inventory area of the GUI for this item.
- actions: A dictionary, being the key the id of the action and the value a list of commands to execute.

:sunglasses: PRO-TIP: There can be hidden items that the player will never obtain, but you can use to define global functions. This functions can be called from any scene and will be available via the goto command. 

## Files: /chapter/scenes/scene_name.json
Here is an example of a scene file: 
```
{
	"name": "A random larder",
	"id": "0_tutorial_larder",
	"image": "0_tutorial_larder.svg",
	"bso": "221_baul_theme",
	"initial_commands": [
	],
	"ending_commands": [
	],
	"default_commands": [
		{
			"com": "rand",
			"coms":
					  [
						  [
							  {
								  "com": "ntxt",
								  "txt": [
									  "#I'd prefer not to do THAT."
								  ]
							  }
						  ],
						  [
							  {
								  "com": "ntxt",
								  "txt": [
									  "#Eh... Nope."
								  ]
							  }
						  ],
						  [...]
		}
	],
	"characters": [
		{
			"id": "door_id",
			"name": "door to entrance",
			"image": "221b_puerta_despensa.jpg",
			"actions": {
				"look":[
					{
						"com": "goto",
						"type":"character",
						"object":"door",
						"action": "use"
					}
				],
                "mix":{
                    "hammer_id":[
                        {...},...
                    ]
                }
				...
			}
		},
        {
			"id": "hammer_id",
			"name": "small hammer",
			"cond": "! #item('hammer_id')",
			"actions": {
                ...
            }
        },
        {...}]
}
```
This is most probably the most complex configuration file, because it has most of the logic of the game. Let's dive into it:
- name: This will be the name used in the GUI to show the name of the current scene, inside the scene name area. Also will be used while saving and loading a game in a memory slot
- id: The id of the scene. Will be the same as the file name.
- image: The file that will be loaded and shown automatically when entering the scene.
- bso: The file with the soundtrack of the scene. 
- initial_commands: A list of commands that will be executed before anything just after entering the scene. This can be used, as in the demo scene of the studio, to make something the first time the player enters a scene.
- ending_commands: The same as initial_commands, but just before leaving the scene.
- default_commands: This is a list of commands to execute when an action is not found in a character. This is a easy and cheap way to save time and code. 
- characters: A dictionary with an entry for each character of the scene. In the scene, any object that the player can interact with is a character.


Each character of the scene will have the following fields:
- id: This ID will be the same as defined in the attribute "character" of the character in the SVG of the scene image.
- name: The text that will be shown in the GUI in the action text area.
- image: This field if optional. It defines the image located in the directory /chapter/characters that will be shown in the GUI in the notebook area.
- cond: This field is optional. It defines a condition that will be evaluated at the loading of the scene. If false, the character will be hidden from the SVG image of the scene and will not be shown in the GUI notebook area.
- actions: If the action is not dative, a dictionary being the key the actions and the value a list of commands that will be executed. If the action is dative (pe. "give"), a dictionary with the ID of the possible objects as key (pe. "hammer_id") and as value, a list of commands. 

:pencil2: NOTE: For the condition, the format is the following:
- The boolean operators os JavaScript are valid (! && ||) as well as parenthesis to group operands.
- To check if a player has an object, the syntax will be: #item('item_id')
- To check if a player has a flag, the syntax will be: #flag('flag_id')

:sunglasses: PRO-TIP: An easy way to remove an object from an scene after the player takes it, is defining a condition with #item('item_id'), as can be seen in the example file with the 'hammer'

:sunglasses: PRO-TIP: The same way as with the items, you can define non-standard actions in the characters. This code will only be accessible via the goto command. This is a way to save time and code. The difference between defining the function in a scene or in the items file is that defining it in the scene will only be accessible when the player is in this scene. This can be used if you want to execute an action only if the player is in a scene (for example, mixing some ancient tokens in front of a magical shrine).

## Directory: /chapter/scenes
In this directory there will be all the scene_name.json of the game.

## Directory: /chapter/characters
In this directory there will be all the images of the characters of the scenes, defined in the "image" file of each character.

## Directory: /chapter/gui
In this directory will be the file gui.svg. This file will be the user interface of the game.

## Directory: /chapter/images
In this directory there will be all the SVG images of the scenes and their accessory images for characters (see the example of the hammer in the tutorial larder scene). 

The format of this files is explained in another document.

## Directory: /chapter/items
In this directory there will be all the images of the items of the game. 

## Directory: /chapter/music
In this directory there will be all all the files for the soundtrack of the scenes.

## Directory: /chapter/sounds
In this directory there will be all the possible sounds played, both from the GUI itself or by the script of the scenes or items. 

## Directory: /chapter/splash
In this directory there will be all splash screens of the game.
