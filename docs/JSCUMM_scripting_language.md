# JSCUMM scripting language
In the configuration files of the items and the scenes, are lists of commands that are executed when an action is used in an item or a character. 

The possible commands are these:

## scn
Loads a new scene.

Format:
```
{
	"com": "scn",
	"scene": "scene_id"
}
```

## ntxt
Open the text window and shows a list of texts. 

The character # acts a new line separator.

The first line of each text will be matched against the 'text_images' attribute of the /chapter/config.json file. If the text in the first line is found, that image will also be shown.

Format:
```
{
    "txt": [
		"David:#Hi! I'm the creator and maintainer of the JSCUMM engine.",
		"David:#This engine was created to create graphical adventure with or without three headed monkeys."
    ]
}
```

## +flag / -flag
Puts and removes flags to the player.

Flags are milestones in the game. They allow the programmer to create the logic of the game in order to show or hide options, characters, or execute an action or another.

Format:
```
{
	"com": "+flag",
	"flag": "flag_id"
}

{
	"com": "-flag",
	"flag": "flag_id"
}
```

## +item / -item
Puts and removes an item from the inventory.

Format:
```
{
	"com": "+item",
	"item": "item_id"
}

{
	"com": "+item",
	"item": "item_id"
}
```

## \<condition\>
In some commands there are \<condition\> statements. This has the same format. They are boolean statements, with the JavaScript boolean operator, with parenthesis. 

There are 2 functions that can be used in the \<condition\> statement: 
- #flag('flag_id'): true if the player has the flag with that ID.
- #item('item_id'): tue if the inventory has the item with that ID.

Some examples of conditions are:
```
This is true if the player has wither flag1_id or flag2_id:
"#flag('flag1_id') || #flag('flag2_id')" 

This is true if the player has the flag1_id and does not have the item1_id in the inventory:
"#flag('flag1_id') && (! #item('item1_id'))"

```

## if
This command allows the programmer to create if-then-else structures. 

Format:
```
{
    "com":"if",
    "cond": <condition>,
    "then": [<command>,<command>,...]
    "else": [<command>,<command>,...]
}
```

## goto
This command calls an action in a character or an item.

Format:
```
{
	"com": "goto",
	"type": "character" or "item",
	"object": "character_id or item_id",
	"action": "action_id",
	"dative": "dative_object_id"
}
```
There are some special fields in this command:
- type: Can be either "character" if the destination is a character inside the current scene or "item" if it is an item in the global inventory. 
- dative: This optional field allows to call dative actions. 


## rand
This command allows to execute a random list of commands among various of them.

Format:
```
{
    "com":"rand",
    "coms":[
        [<command>,<command>,...],
        ...
        [<command>,<command>,...]
    ]
}
```

## ops / -ops / --ops
This command open the text options dialog, shows the different options and wait for the player to choose one of them.

A particular option can have an optional field 'cond' that contains a condition that will be evaluated. The option will be shown only if the condition is true.

Format:
```
{
    "com":"ops",
    "ops":[
        {
            "txt":"Option 1 text",
            "cond": <condition>,
            "coms":[<command>,<command>,...]
        },
        {
            "txt":"Option 2 text",
            "cond": <condition>,
            "coms":[<command>,<command>,...]
        },
        ...
        {
            "txt": "Exit options text",
            "coms":[
                {
                    "com": "-ops"
                }
            ]
        }
    ]
}
```

Along with this 'ops' command, come two other commands: '-ops' and '--ops'. 

The text options can be nested, in order to create a tree of dialog. 
- The command '-ops' exits the current options menu and shows the parent. 
- The command '--ops' exits all the options menus. 

The format of these commands is:
```
{
    "com": "-ops"
}

{
    "com": "--ops"
}
```

## +char / -char
This commands shows and hides a character in the GUI notebook and in the SVG image of the scene.

Format: 
```
{
	"com": "+char",
	"character": "character_id"
}

{
	"com": "-char",
	"character": "character_id"
}
```

## +img / -img
This commands shows and hides a SVG image. Its size will be the same as the scene image, leaving available the actions and items menus.

Format: 
```
{
	"com": "+img",
	"image": "image_file"
}

{
	"com": "-img",
	"image": "image_file"
}
```

## +splash / -splash
This commands shows and hides a SVG splash image. The image will be shown in full screen size, hiding all the menus.

Format: 
```
{
	"com": "+splash",
	"splash": "splash_image_file"
}

{
	"com": "-splash",
	"splash": "splash_image_file"
}
```

## sound
This command plays a sound effect.

Format: 
```
{
	"com": "sound",
	"sound": "sound_file"
}
```

## sleep
This command pauses the execution of commands and resumes it after certain seconds.

Format:
```
{
	"com": "sleep",
	"seconds": "number_seconds"
}
```

## exit
This command clean the queue of commands pending for execution.

Format:
```
{
	"com": "exit"
}
```