/* global log, GUITEXTO, GUISVG */

// Constants definition
var CONFIG_DIR = "chapter";
var SCENES_DIR = "chapter/scenes";
var ACTIONS_DIR = "chapter";
var ITEMS_DIR = "chapter";
var DEFAULT_ACTION_ID = "look";
var PC_CLIENT = "PC";
var ANDROID_CLIENT = "ANDROID";
var NUMBER_SLOTS_SAVED_GAMES = 3;

// In seconds
var MAX_WAIT_MUTEX = 10;
// In milliseconds
var SLEEP_TIME_MUTEX = 1000;

// Global variables dfinition
var JSCUMM = new Object();

//Config of the game
JSCUMM.config = null;
JSCUMM.actions = null;
JSCUMM.arch = PC_CLIENT;

// The scene containing the characters
JSCUMM.escene = null;

// Items of the chapter
JSCUMM.items = [];

// Items of the inventory
JSCUMM.inventory = [];
JSCUMM.flags = [];

// Definition of saved games and slots
JSCUMM.memory = null;
// The slot 0 is teh current game
JSCUMM.slots_saved_games = [];

// Time played in millisecons (total)
JSCUMM.time_played = 0;

JSCUMM.current_action = null;
JSCUMM.current_object = null;
JSCUMM.commands_queue = [];
JSCUMM.stop_interpreter = false;
// Interpreter of JSCUMM actions
JSCUMM.interpreter = new Object();

// Mutex for sync
JSCUMM.mutex = [];

// GUI
JSCUMM.gui = null;

// Defining log level
log.level = "INFO";

// Initialization
JSCUMM.init = function(gui){
	log.info("(JSCUMM.init) Inilializing SCUMM engine");
	JSCUMM.memory = window.localStorage;
	// Load configuration
	var config_route = CONFIG_DIR + "/config.json";
	try {
		$.getJSON(config_route, function (json) {
			JSCUMM.config = json;
			log.info("(JSCUMM.init) Loading game configuration.");
			log.debug("(JSCUMM.init) Game configuration: " + JSON.stringify(JSCUMM.config));
			// Loading items
			var items_route = ITEMS_DIR + "/items.json";
			$.getJSON(items_route, function (json) {
				JSCUMM.items = json;
				log.info("(JSCUMM.init()) Loading items file.");
				log.trace("(JSCUMM.init) New items: " + JSON.stringify(JSCUMM.items));
				
				// GUI initialization
				gui.init(JSCUMM);
				
				// Load actions
				actions_route = ACTIONS_DIR + "/actions.json";
				$.getJSON(actions_route, function (json) {
					JSCUMM.actions = json;
					log.info("(JSCUMM.init) Loading game actions.");
					log.debug("(JSCUMM.init) New actions: " + JSON.stringify(JSCUMM.actions));
					JSCUMM.put_default_action();
				})
				.error(function(XMLHttpRequest, textStatus, errorThrown){
					log.error("(JSCUMM.load_actions) Error loading actions.");
					log.error("(JSCUMM.load_actions) TextStatus" + textStatus);
					log.error("(JSCUMM.load_actions) ErrorThrown" + errorThrown);
				});
			})
			.error(function(XMLHttpRequest, textStatus, errorThrown){
				log.error("(JSCUMM.load_items) Error loading items.");
				log.error("(JSCUMM.load_items) TextStatus" + textStatus);
				log.error("(JSCUMM.load_items) ErrorThrown" + errorThrown);
			});
		})
		.error(function(XMLHttpRequest, textStatus, errorThrown){
			log.error("(JSCUMM.load_configuration) Error loading cofiguration.");
			log.error("(JSCUMM.load_configuration) TextStatus" + textStatus);
			log.error("(JSCUMM.load_configuration) ErrorThrown" + errorThrown);
		});
	} catch (error) {
		log.error("(JSCUMM.init) Error loading game coniguration.");
		log.error(error);
	}
};

JSCUMM.init_game = function(){
	log.info("(JSCUMM.init_game) Initializing the game ");
	// Initializing game slots
	
	var slots_in_memory = JSCUMM.memory.getItem("game_slots");
	log.info("(JSCUMM.init_game) Loading slots from memory.");
	if (slots_in_memory == null){
		log.info("(JSCUMM.init_game) There were not slots in memory. Loading default scene.");
		JSCUMM.load_scene(JSCUMM.config.first_scene);
	} else{
		log.debug("(JSCUMM.init_game) Slots recovered in memory: " + slots_in_memory + " .");
		JSCUMM.slots_saved_games = eval(slots_in_memory);
		JSCUMM.apply_current_game();
	}
};

JSCUMM.put_default_action = function () {
	if (JSCUMM.actions === null) {
		log.error("(JSCUMM.put_default_action) It was not possible to put the default action due to there is not a list of actions loaded.");
	} else {
		JSCUMM.event_action(search(JSCUMM.actions, "id", DEFAULT_ACTION_ID));
		JSCUMM.current_object = null;
		log.trace("(JSCUMM.put_default_action) Default action established (" + JSON.stringify(JSCUMM.current_action) + ") and current object deleted.");
	}
};

JSCUMM.load_scene = function (scene_name) {
	scene_route = SCENES_DIR + "/" + scene_name + ".json";
	log.info("(JSCUMM.load_scene) Loading scene with the route: " + scene_route);
	
	JSCUMM.mutex["load_scene"] = false;
	try{
		$.getJSON(scene_route, function (json) {
			JSCUMM.escene = json;
			log.debug("(JSCUMM.load_scene) New scene: " + JSCUMM.escene.name);
			log.trace("(JSCUMM.load_scene) New scene: " + JSON.stringify(JSCUMM.escene));
			if (JSCUMM.gui.svg_ready == false){
				log.warning("(JSCUMM.load_scene) Scene loaded without being ready the SVG!");
			}
			JSCUMM.gui.show_scene(JSCUMM.escene);
			JSCUMM.stack_commands(JSCUMM.escene.initial_commands);
		})
		//http://stackoverflow.com/questions/309953/how-do-i-catch-jquery-getjson-or-ajax-with-datatype-set-to-jsonp-error-w/310084#310084
		.error(function(XMLHttpRequest, textStatus, errorThrown){
			log.error("(JSCUMM.load_scene) Error while loading scene: " + scene_name);
			log.error("(JSCUMM.load_scene) TextStatus" + textStatus);
			log.error("(JSCUMM.load_scene) ErrorThrown" + errorThrown);
		});
	}catch(error){
		log.error("(JSCUMM.load_scene) Error while loading the scene file.");
		log.error(error);
	}
};

//How much of the game has been completed
JSCUMM.get_completed_game = function(){
	JSCUMM.get_completed_game_slot(0);
	return(100 * JSCUMM.flags.length / JSCUMM.config.total_number_flags);
};

JSCUMM.get_completed_game_slot = function(slot){
	var game_flags = JSCUMM.slots_saved_games[slot].flags.length;
	return(100 * game_flags / JSCUMM.config.total_number_flags);
};

JSCUMM.restart_game = function(){
	log.info("(JSCUMM.restart_game) Restarting the game.");
	JSCUMM.inventory = [];
	JSCUMM.gui.update_inventory();
	JSCUMM.flags = [];
	JSCUMM.time_played = 0;
	JSCUMM.gui.restart_game();
	JSCUMM.load_scene(JSCUMM.config.first_scene);
};

// Save current game
JSCUMM.save_current_game = function(){
	log.info("(JSCUMM.save_current_game) Saving current game.");
	log.debug("(JSCUMM.save_current_game) Previous current game: " + JSON.stringify(JSCUMM.slots_saved_games[0]));
	
	JSCUMM.slots_saved_games[0] = {};
	JSCUMM.slots_saved_games[0].scene_id = JSCUMM.escene.id;
	JSCUMM.slots_saved_games[0].scene_name = JSCUMM.gui._(JSCUMM.escene.name);
	JSCUMM.slots_saved_games[0].inventory = JSCUMM.inventory.slice();
	JSCUMM.slots_saved_games[0].flags = JSCUMM.flags.slice();
	JSCUMM.slots_saved_games[0].time_played = JSCUMM.time_played;
	log.debug("(JSCUMM.save_current_game) New current game: " + JSON.stringify(JSCUMM.slots_saved_games[0]));
	JSCUMM.write_game_in_memory();
};

JSCUMM.apply_current_game = function(){
	log.info("(JSCUMM.apply_current_game) Applying current game.");
	log.debug("(JSCUMM.apply_current_game) Game to apply: " + JSON.stringify(JSCUMM.slots_saved_games[0]));
	
	//http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
	JSCUMM.inventory = JSCUMM.slots_saved_games[0].inventory.slice();
	JSCUMM.flags = JSCUMM.slots_saved_games[0].flags.slice();
	JSCUMM.time_played = JSCUMM.slots_saved_games[0].time_played;
	JSCUMM.gui.update_inventory();
	JSCUMM.load_scene(JSCUMM.slots_saved_games[0].scene_id);
};

JSCUMM.load_current_game_from_slot = function(slot){
	log.info("(JSCUMM.load_current_game_from_slot) Loading game in slot '" + slot + "'.");
	
	if (slot > NUMBER_SLOTS_SAVED_GAMES){
		log.error("(JSCUMM.load_current_game_from_slot) Slot not valid");
	} else if (JSCUMM.slots_saved_games[slot] == undefined){
		log.error("(JSCUMM.load_current_game_from_slot) Slot empty");
	} else{
		log.debug("(JSCUMM.load_current_game_from_slot) Game to load: " + JSON.stringify(JSCUMM.slots_saved_games[slot]));
		//https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign
		JSCUMM.slots_saved_games[0] = Object.assign(JSCUMM.slots_saved_games[slot]);
		JSCUMM.write_game_in_memory();
		JSCUMM.apply_current_game();
	}
};

JSCUMM.save_current_game_in_slot = function(slot){
	log.info("(JSCUMM.save_current_game_in_slot) Saving the current game in slot '" + slot + "'.");
	if (slot > NUMBER_SLOTS_SAVED_GAMES){
		log.error("(JSCUMM.save_current_game_in_slot) Slot not valid");
	} else {
		//https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign
		JSCUMM.slots_saved_games[slot] = Object.assign(JSCUMM.slots_saved_games[0]);
		JSCUMM.write_game_in_memory();
	}
};

JSCUMM.write_game_in_memory = function(){
	log.info("(JSCUMM.write_game_in_memory) Writing in file according to architecture:'" + JSCUMM.arch + "'.");
	switch (JSCUMM.arch){
		case PC_CLIENT:
			log.debug("(JSCUMM.write_game_in_memory) Games file: " + JSON.stringify(JSCUMM.slots_saved_games));
			try{
				JSCUMM.memory.setItem("game_slots",JSON.stringify(JSCUMM.slots_saved_games));
			} catch(error){
				log.error("(JSCUMM.write_game_in_memory) Error while writing in memory.");
				log.error(error);
			}
			break;
		default:
			log.warning("(JSCUMM.write_game_in_memory) Architecture not supported");
	}
};

JSCUMM.write_user_lang = function(lang){
	log.info("(JSCUMM.write_user_lang) Writing in file according to architecture:'" + JSCUMM.arch + "'.");
	switch (JSCUMM.arch){
		case PC_CLIENT:
			log.debug("(JSCUMM.write_user_lang) Language to save: " + lang);
			try{
				JSCUMM.memory.setItem("user_lang",lang);
			} catch(error){
				log.error("(JSCUMM.write_user_lang) Error while writing in memory.");
				log.error(error);
			}
			break;
		default:
			log.warning("(JSCUMM.write_user_lang) Architecture not supported");
	}
	
};

// Wait until mutex is available
JSCUMM.wait_mutex = function (mutex_id) {
	log.info("(JSCUMM.wait_mutex) Waiting for the mutex '" + mutex_id + "'");
	if (JSCUMM.mutex[mutex_id] === undefined) {
		log.warning("(JSCUMM.wait_mutex) The mutex '" + mutex_id + "' is not initialized");
		return;
	} else {
		var current_wait = 0;
		while ((current_wait < MAX_WAIT_MUTEX) && (JSCUMM.mutex[mutex_id] == false)) {
			sleepFor(SLEEP_TIME_MUTEX);
			current_wait++;
			log.info("(JSCUMM.wait_mutex) Wait in the mutex '" + mutex_id + "' after waiting '" + current_wait + "' seconds");
		}
		log.info("(JSCUMM.wait_mutex) Going out from the mutex '" + mutex_id + "' after waiting '" + current_wait + "' seconds");
	}
};

// Manage the reception of an action
JSCUMM.event_action = function (action) {
	JSCUMM.current_action = action;
	log.debug("(JSCUMM.event_action) Update current action: " + action.id);
	JSCUMM.gui.update_current_action(action);
	JSCUMM.current_object = null;
	log.trace("(JSCUMM.event_action) Cleaned the current object.");

};

// Manage the reception of an object (Item of the inventory or character)
JSCUMM.event_object = function (object) {
	log.debug("(JSCUMM.event_object) Received object: " + object.id);
	log.trace("(JSCUMM.event_object) Received object: " + JSON.stringify(object));
	try {
		if (JSCUMM.current_action.dative == true) {
			if (JSCUMM.current_object == null) {
				log.debug("(JSCUMM.event_object) The current action (" + JSCUMM.current_action.id + ") is dative and there is not a current object. Wait for the indirect complement.");
				JSCUMM.gui.update_current_object(object, false);
				JSCUMM.current_object = object;
				log.trace("(JSCUMM.event_object) Current object updated: " + object.id);
			} else {
				log.debug("(JSCUMM.event_object) The current action  (" + JSCUMM.current_action.id + ") is dative and there is a current object (" + JSCUMM.current_object.id + ").");
				JSCUMM.gui.update_current_object(object, true);
				// The actions to exec are in the last object selected
				if (object.actions[JSCUMM.current_action.id] == undefined) {
					// There is not action defined for this object
					log.debug("(JSCUMM.event_object) Not found the current action (" + JSCUMM.current_action.id + ") in the object (" + object.id + "). Looking for the default commands.");
					JSCUMM.put_default_commands(object);
				} else if (object.actions[JSCUMM.current_action.id][JSCUMM.current_object.id] == undefined) {
					// No está definido el objeto para la acción en este objeto
					log.debug("(JSCUMM.event_object) No se encuentra el objeto actual (" + JSCUMM.current_object.id + ") en la acción (" + JSCUMM.current_action.id + ") del objeto (" + object.id + "). Se buscan comandos por defecto.");
					JSCUMM.put_default_commands(object);
				} else {
					log.trace("(JSCUMM.event_object) Queue the commands of the object: " + JSON.stringify(object.actions[JSCUMM.current_action.id][JSCUMM.current_object.id]));
					JSCUMM.queue_commands(object.actions[JSCUMM.current_action.id][JSCUMM.current_object.id]);
				}
			}
		}
		// If the action is not dative
		else {
			log.debug("(JSCUMM.event_object) The current action (" + JSCUMM.current_action.id + ") is not dative.");
			JSCUMM.gui.update_current_object(object, false);
			if (object.actions[JSCUMM.current_action.id] == undefined) {
				// The current action is not defined in this object
				log.debug("(JSCUMM.event_object) Not found current action (" + JSCUMM.current_action.id + ") in the object (" + object.id + "). Looking for alternative commands.");
				if (JSCUMM.current_action.alternative != undefined){
					if (object.actions[JSCUMM.current_action.alternative] != undefined){
						JSCUMM.queue_commands(object.actions[JSCUMM.current_action.alternative]);
					}else{
						JSCUMM.put_default_commands(object);
					}
				} else{
					log.debug("(JSCUMM.event_object) Not found current action (" + JSCUMM.current_action.id + ") in the object (" + object.id + "). Looking for the default commands.");
					JSCUMM.put_default_commands(object);
				}
			} else {
				// The current action is defined for this object
				log.trace("(JSCUMM.event_object) The commands of the object for this action are queued: " + JSON.stringify(object.actions[JSCUMM.current_action.id]));
				JSCUMM.queue_commands(object.actions[JSCUMM.current_action.id]);
			}
		}
	} catch (error) {
		log.error("(JSCUMM.event_object) Error receiving an object.");
		log.error(error);
	}
};

// The commands by default are either in the object or in the scene
// NOTE: Would it be interesting default actions per chapter?
JSCUMM.put_default_commands = function (object) {
	log.debug("(JSCUMM.put_default_commands) Look up the default commands of the object: " + object.id);
	try {
		if (object.actions.def == undefined) {
			log.debug("(JSCUMM.put_default_commands) The object: (" + object.id + ") Has no default actions. Queueing the default actions of the scene.");
			JSCUMM.queue_commands(JSCUMM.escene.default_commands);
		} else {
			log.debug("(JSCUMM.put_default_commands) The object: (" + object.id + ") has defined actions by default. Queueing them.");
			JSCUMM.queue_commands(object.actions.def);
		}
	} catch (error) {
		log.error("(JSCUMM.put_default_commands) Error while putting the actions by default.");
		log.error(error);
	}
};

// Queue the commands that come from an object at the end of the queue
JSCUMM.queue_commands = function (commands) {
	if (commands == null) {
		log.error("(JSCUMM.queue_commands) Null list of commands");
		return;
	}
	log.debug("(JSCUMM.queue_commands) Queueing the following commands: " + JSON.stringify(commands));
	for (var index = 0; index < commands.length; index++) {
		JSCUMM.commands_queue.push(commands[index]);
	}
	JSCUMM.execute_commands();
};

// Stack the commands that come from an object at the beginning of the queue
JSCUMM.stack_commands = function (commands) {
	if (commands == null) {
		log.error("(JSCUMM.stack_commands) Null list of commands");
		return;
	}
	log.debug("(JSCUMM.stack_commands) Stacking the following commands: " + JSON.stringify(commands));
	JSCUMM.commands_queue = commands.concat(JSCUMM.commands_queue);
	JSCUMM.execute_commands();
};

JSCUMM.execute_commands = function () {
	while ((JSCUMM.commands_queue.length > 0) && !JSCUMM.stop_interpreter) {
		try {
			current_command = JSCUMM.commands_queue.shift(1);
		} catch (error) {
			log.error("(JSCUMM.execute_commands) Error al recuperar el siguiente comando a interpretar");
			log.error("(JSCUMM.execute_commands) " + error);
		}
		log.info("(JSCUMM.execute_commands) Execute command: " + current_command.com);
		log.debug("(JSCUMM.execute_commands) Execute command: " + JSON.stringify(current_command));
		JSCUMM.interpreter.interpret_command(current_command);
	}
	if (JSCUMM.commands_queue.length == 0 && !JSCUMM.stop_interpreter) {
		JSCUMM.put_default_action();
	}
};

JSCUMM.stop_command_execution = function () {
	log.debug("(JSCUMM.stop_command_execution) Stoping the execution of the commands.");
	JSCUMM.stop_interpreter = true;
};

JSCUMM.continue_commands_execution = function () {
	log.debug("(JSCUMM.continue_commands_execution) Continuig the execution of the commands.");
	JSCUMM.stop_interpreter = false;
	// Stoping all the pauses
	if (JSCUMM.commands_queue.length > 0) {
		while (JSCUMM.commands_queue[0].com == "pause") {
			JSCUMM.commands_queue.shift();
			if (JSCUMM.commands_queue.length == 0) {
				break;
			}
		}
	}
	JSCUMM.execute_commands();
};

// Returns true if the player has the flag
JSCUMM.has_flag = function (flag) {
	log.debug("(JSCUMM.has_flag) Asking about the flag: " + flag);
	return(JSCUMM.flags.indexOf(flag) > -1);
};

// Returns true if the player has the item
JSCUMM.has_item = function (item) {
	log.debug("(JSCUMM.has_item) Asking about the item: " + item);
	return(JSCUMM.inventory.indexOf(item) > -1);
};

JSCUMM.eval_condition = function (condition) {
	log.debug("(JSCUMM.eval_condition) Evaluation the condition: " + condition);
	if (condition == undefined) {
		return(true);
	} else if (condition == "") {
		return(true);
	}
	try {
		var query = condition.replace(/#flag/g, "JSCUMM.has_flag");
		query = query.replace(/#item/g, "JSCUMM.has_item");
		var result = eval(query);
		return(result);
	} catch (error) {
		log.error("(JSCUMM.eval_condition) Error evaulating the condition: " + condition);
		log.error("(JSCUMM.eval_condition) " + error);
	}
};

// Commands interpreter
JSCUMM.interpreter.interpret_command = function (command) {
	log.debug("(JSCUMM.interpret_command) Interpret the command: " + JSON.stringify(command));
	try {
		switch (command.com) {
			case "scn":
				JSCUMM.interpreter.load_scene(command.scene);
				break;
			case "ntxt":
				JSCUMM.interpreter.new_text(command);
				break;
			case "+flag":
				JSCUMM.interpreter.take_flag(command.flag);
				break;
			case "-flag":
				JSCUMM.interpreter.leave_flag(command.flag);
				break;
			case "+item":
				JSCUMM.interpreter.take_item(command.item);
				break;
			case "-item":
				JSCUMM.interpreter.leave_item(command.item);
				break;
			case "+char":
				JSCUMM.interpreter.put_character(command.character);
				break;
			case "-char":
				JSCUMM.interpreter.remove_character(command.character);
				break;
			case "+img":
				JSCUMM.interpreter.show_image(command.image);
				break;
			case "-img":
				JSCUMM.interpreter.remove_image();
				break;
			case "+splash":
				JSCUMM.interpreter.show_splash_image(command.image);
				break;
			case "-splash":
				JSCUMM.interpreter.remove_image_splash();
				break;
			case "if":
				JSCUMM.interpreter.conditional(command);
				break;
			case "ops":
				JSCUMM.interpreter.options(command);
				break;
			case "-ops":
				JSCUMM.interpreter.remove_options();
				break;
			case "--ops":
				JSCUMM.interpreter.exit_options();
				break;
			case "pause":
				JSCUMM.interpreter.pause();
				break;
			case "rand":
				JSCUMM.interpreter.random(command);
				break;
			case "goto":
				JSCUMM.interpreter.goto(command);
				break;
			case "sleep":
				JSCUMM.interpreter.sleep(command.seconds);
				break;
			case "exit":
				JSCUMM.interpreter.exit();
				break;
			case "sound":
				JSCUMM.interpreter.sound(command.sound);
				break;
			default:
				log.error("(JSCUMM.interpret_command) Command not found: " + JSON.stringify(command));
		}
	} catch (error) {
		log.error("(JSCUMM.interpret_command) Error while interpreting the command: " + JSON.stringify(command));
		log.error("(JSCUMM.interpret_command) " + error);
	}
};

JSCUMM.interpreter.load_scene = function (scene_id) {
	log.info("(JSCUMM.interpreter.load_scene) Carga el escenario: '" + scene_id + "'");
	try {
		JSCUMM.load_scene(scene_id);
	} catch (error) {
		log.error("(JSCUMM.interpreter.load_scene) Error al cargar el escenario.");
		log.error(error);
	}
};

// Adds a flag
JSCUMM.interpreter.take_flag = function (flag_id) {
	log.debug("(JSCUMM.interpreter.take_flag) Taking flag: '" + flag_id + "'");
	try {
		var index_flag_to_take = JSCUMM.flags.indexOf(flag_id);
		if (index_flag_to_take >= 0) {
			log.debug("(JSCUMM.interpreter.take_flag): Flag already taken: " + flag_id);
			return(false);
		} else {
			JSCUMM.flags.push(flag_id);
			JSCUMM.save_current_game();
			log.trace("(JSCUMM.interpreter.take_flag): After taking the flag, the list of flags is this: " + JSCUMM.flags);
			JSCUMM.gui.take_flag(flag_id);
		}
	} catch (error) {
		log.error("(JSCUMM.interpreter.take_flag) Error taking the flag.");
		log.error("(JSCUMM.interpreter.take_flag) " + error);
	}
};

// Removes a flag
JSCUMM.interpreter.leave_flag = function (flag_id) {
	log.debug("(JSCUMM.interpreter.leave_flag) Leaving the flag: '" + flag_id + "'");
	try {
		var index_flag_to_take = JSCUMM.flags.indexOf(flag_id);
		if (index_flag_to_take < 0) {
			log.debug("(JSCUMM.interpreter.leave_flag): Flag not found: " + flag_id);
		} else {
			JSCUMM.flags.splice(index_flag_to_take, 1);
			JSCUMM.save_current_game();
			log.trace("(JSCUMM.interpreter.leave_flag): After leaving the flag, the list of flags is this: " + JSCUMM.flags);
			JSCUMM.gui.leave_flag(flag_id);

		}
	} catch (error) {
		log.error("(JSCUMM.interpreter.leave_flag) Error leaving the flag.");
		log.error("(JSCUMM.interpreter.leave_flag) " + error);
	}
};

// Adds an item to the inventory
JSCUMM.interpreter.take_item = function (item_id) {
	log.debug("(JSCUMM.interpreter.take_item) Take the item: '" + item_id + "'");
	try {
		if (search(JSCUMM.items, "id", item_id) == null) {
			log.error("(JSCUMM.interpreter.take_item) The item does not exists in the item list of the chapter: '" + item_id + "'");
		} else if (JSCUMM.inventory.indexOf(item_id) > -1) {
			log.warning("(JSCUMM.interpreter.take_item) The item is already in the inventory and is not added: '" + item_id + "'");
		} else {
			JSCUMM.inventory.push(item_id);
			JSCUMM.save_current_game();
			log.trace("(JSCUMM.interpreter.take_item): After taking the item, the inventory is this: " + JSCUMM.inventory);
			JSCUMM.gui.take_item();
		}
	} catch (error) {
		log.error("(JSCUMM.interpreter.take_item) Error taking the item.");
		log.error("(JSCUMM.interpreter.take_item) " + error);
	}
};

// Removes an item from the inventory
JSCUMM.interpreter.leave_item = function (item_id) {
	log.debug("(JSCUMM.interpreter.leave_item) Leaving the item: '" + item_id + "'");
	try {
		var index_item_to_leave = JSCUMM.inventory.indexOf(item_id);
		if (index_item_to_leave < 0) {
			log.warning("(JSCUMM.interpreter.leave_item): Item not found: '" + item_id + "' in the inventory.");
		} else {
			JSCUMM.inventory.splice(index_item_to_leave, 1);
			JSCUMM.save_current_game();
			log.trace("(JSCUMM.interpreter.leave_item): After leaving the item, the inventory is this: " + JSCUMM.inventory);
			JSCUMM.gui.update_inventory();
		}
	} catch (error) {
		log.error("(JSCUMM.interpreter.leave_item) Error leaving the item.");
		log.error("(JSCUMM.interpreter.leave_item) " + error);
	}
};

// Makes visible a character in the GUI
JSCUMM.interpreter.put_character = function (character_id) {
	log.debug("(JSCUMM.interpreter.put_character) Puts the character: '" + character_id + "'");
	try {
		JSCUMM.gui.put_character(character_id);
	} catch (error) {
		log.error("(JSCUMM.interpreter.put_character) Error puting the character.");
		log.error("(JSCUMM.interpreter.put_character) " + error);
	}
};

// Makes invisible a character in the GUI
JSCUMM.interpreter.remove_character = function (character_id) {
	log.debug("(JSCUMM.interpreter.remove_character) Removing character: '" + character_id + "'");
	try {
		JSCUMM.gui.remove_character(character_id);
	} catch (error) {
		log.error("(JSCUMM.interpreter.remove_character) Error removing character.");
		log.error("(JSCUMM.interpreter.remove_character) " + error);
	}
};

//TODO: Is this used somewhere?
// comando "Texto" { "com":"txt" , "txt": ["texto1" , "texto2"] }
JSCUMM.interpreter.texto = function (command) {
	JSCUMM.gui.texto(command.txt);
};

// {"com": "if", "cond": [flags],"then": [comandos],"else": [comandos]}
// If the condition is true, stacks the commands in the "then" attribute
// If the condition is false, stacks the commands in the "else" attribute
JSCUMM.interpreter.conditional = function (command) {
	log.debug("(JSCUMM.interpreter.conditional) conditional command: '" + JSON.stringify(command) + "'");
	log.debug("(JSCUMM.interpreter.conditional) Current flags: '" + JSCUMM.flags + "'");

	try {
		if (command.cond == null) {
			log.error("(JSCUMM.interpreter.conditional) No condition.");
			return(false);
		}
		if (command.cond.length == 0) {
			log.warning("(JSCUMM.interpreter.conditional) Empty condition.");
			return(false);
		}

		var evaluation_of_condition = JSCUMM.eval_condition(command.cond);
		if (evaluation_of_condition == true) {
			// All conditions are true
			if (command["then"].length > 0) {
				log.debug("(JSCUMM.interpreter.conditional) Condition evaluated as TRUE. Staking the commands of 'then'.");
				JSCUMM.stack_commands(command["then"]);
			} else {
				log.debug("(JSCUMM.interpreter.conditional) Condition evaluated as TRUE but no commands in 'then'.");
			}
		} else {
			//Condition false
			if (command["else"].length > 0) {
				log.debug("(JSCUMM.interpreter.conditional) Condition evaluated as FALSE. Staking the commands of 'else'.");
				JSCUMM.stack_commands(command["else"]);
			} else {
				log.debug("(JSCUMM.interpreter.conditional) Condition evaluated as FALSE but no commands in 'else'.");
			}
		}
	} catch (error) {
		log.error("(JSCUMM.interpreter.conditional) Error in the conditional command.");
		log.error("(JSCUMM.interpreter.conditional) " + error);
	}
};

// comando "Nuevo texto" { "com":"ntxt" , "txt": ["texto1" , "texto2"] }
JSCUMM.interpreter.new_text = function (command) {
	JSCUMM.gui.new_text(command.txt);
};

// { "com": "ops", "ops": [{"txt": "texto","coms":[comandos]}] }
// Shows text options to choose
// Options can be nested
JSCUMM.interpreter.options = function (command) {
	JSCUMM.gui.new_options(command.ops);
};

// Remove current text options.
// If there are nested options, shows the previous one.
JSCUMM.interpreter.remove_options = function () {
	JSCUMM.gui.remove_options();
};

// Exit all the possible nested text options
JSCUMM.interpreter.exit_options = function () {
	JSCUMM.gui.exit_options();
};

// { "com": "+img", "image": "estacion_tren.svg" }
// Shows the image of a scene (or other custom image)
JSCUMM.interpreter.show_image = function (image) {
	JSCUMM.gui.show_image(image);
};

// Removes the image of a scene (or other custom image)
JSCUMM.interpreter.remove_image = function () {
	JSCUMM.gui.remove_image();
};

// Shows a full screen image
JSCUMM.interpreter.show_splash_image = function (image) {
	JSCUMM.gui.show_splash_image(image);
};

// Removes a full screen image
JSCUMM.interpreter.remove_image_splash = function () {
	JSCUMM.gui.remove_image_splash();
};

// Wait for interaction with the GUI
JSCUMM.interpreter.pause = function () {
	JSCUMM.stop_command_execution();
};

// Choose randomly between a set of commands lists.
JSCUMM.interpreter.random = function (command) {
	log.debug("(JSCUMM.interpreter.random) Random command: '" + JSON.stringify(command) + "'");
	try {
		if (command.coms == null) {
			log.error("(JSCUMM.interpreter.random) Commands are null.");
			return(false);
		}
		if (command.coms.length == 0) {
			log.warning("(JSCUMM.interpreter.random) There are no commands.");
			return(true);
		}
		var index = Math.floor(Math.random() * (command.coms.length));
		log.debug("(JSCUMM.interpreter.random) Number of elements: " + command.coms.length + ". Selected index: " + index);
		log.debug("(JSCUMM.interpreter.random) Commands stacked: " + JSON.stringify(command.coms[index]));
		JSCUMM.stack_commands(command.coms[index]);
	} catch (error) {
		log.error("(JSCUMM.interpreter.random) Error in the random command.");
		log.error("(JSCUMM.interpreter.random) " + error);
	}
};

// Goto is a way to make a call to a function defined in an object or a item.
// This is usefull to reuse code in the scripts.
// This options can be the standars accesible by the GUI or new ones only reachable 
// by this goto calls. This way, functions for the scene can be defined.
// There can be items that the player never will obtain and can be uses to declare 
// global functions in the chapter. 
// A parameter can be passed to the functions with the "dative" parameter, for example,
// to use an object with another or to give something to someone.
JSCUMM.interpreter.goto = function (command) {
	log.debug("(JSCUMM.interpreter.goto) Goto command: '" + JSON.stringify(command) + "'");
	var container;
	
	switch (command.type){
		case "character": 
			container = JSCUMM.escene.characters;
			break;
		case "item": 
			container = JSCUMM.items;
			break;
		default:
			log.error("(JSCUMM.interpreter.goto) The type of container is incorrect: '" + command.type + "'.");
			return(false);
	}
	var object = search(container,"id",command.object);
	
	if (object == null){
		log.error("(JSCUMM.interpreter.goto) Object not found: '" + command.object + "'.");
		return(false);
	}
	
	try{
		if (command.dative == undefined){
			actions = object.actions[command.action];
		} else{
			actions = object.actions[command.action][command.dative];
		}		
	} catch (error){
			log.error("(JSCUMM.interpreter.goto) Error in GOTO command.");
			log.error("(JSCUMM.interpreter.goto) " + error);
	}
	
	if (actions == undefined){
		log.error("(JSCUMM.interpreter.goto) No actions found in the GOTO command.");
		log.error("(JSCUMM.interpreter.goto) Comando:" + JSON.stringify(command));
	} else {
		JSCUMM.stack_commands(actions);
	}
};

// Wait for a time defined in seconds
JSCUMM.interpreter.sleep = function (seconds) {
	sleepFor(seconds * 1000);
};

// Empty the commands queue
JSCUMM.interpreter.exit = function () {
	log.debug("(JSCUMM.interpreter.exit) Exit command.'");
	JSCUMM.commands_queue = [];
};

JSCUMM.interpreter.sound = function (sound) {
	JSCUMM.gui.play_sound(sound);
};