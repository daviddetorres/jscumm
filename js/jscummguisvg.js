/* global log, wordwrap, JSCUMM, buzz, NUMBER_SLOTS_SAVED_GAMES */

// Referencias 
// Librería SVG: http://keith-wood.name/svgRef.html

// constants
var GUI_DIRECTORY = "./chapter/gui/";
var LANG_DIRECTORY = "./chapter/languages/";
var ITEMS_IMAGES_DIRECTORY = "./chapter/items/";
var CHARACTERS_IMAGES_DIRECTORY = "./chapter/characters/";
var IMAGES_DIRECTORY = "./chapter/images/";
var SPLASH_IMAGES_DIRECTORY = "./chapter/splash/";
var BSO_DIRECTORY = "./chapter/music/";
var SOUNDS_DIRECTORY = "./chapter/sounds/";
var GUI_FILE = "gui.svg";

// TODO
var PROJECT_PAGE = "https://github.com/daviddetorres/jscumm";
// TODO
var LICENSE_PAGE = "https://github.com/daviddetorres/jscumm/LICENSE.md";


var MAX_CHARS_TEXT_LINE = 70;
var TEXT_LINES = 5;
var OPTIONS_LINES = 5;
var PAUSE_COMMAND = {"com": "pause"};

var NUMBER_ITEMS_GUI = 6;

var MAX_CHARS_CHARACTER_LINE = 15;
var CHARACTER_LINES = 2;
var NUMBER_CHARACTERS_GUI = 8;

var SCENE_NAME_LINES = 2;
var MAX_CHARS_SCENE_NAME_LINE = 17;

var SVG_WIDTH = 1920;
var SVG_HEIGHT = 900;
var SVG_ASPECT_RATIO = SVG_WIDTH / SVG_HEIGHT;
// If there is banner, change also in css
var BANNER_HEIGHT = 0;

var IMAGE_HORIZONTAL_POSITION = 455;
var IMAGE_VERTICAL_POSITION = 80;
var SPLASH_IMAGE_HORIZONTAL_POSITION = 0;
var SPLASH_IMAGE_VERTICAL_POSITION = 0;

// Constants for sounds
var FADE_IN_TIME = 3000;
var CROSS_FADE_TIME = 1500;
var BSO_VOLUME = 30; //10-100
var SOUND_VOLUME = 80; //10-100

// Sound effects
var SOUND_PENCIL = "escribir";
var SOUND_PAPER = "papel";
var SOUND_ITEMS = "hoja_pequenya";
var SOUND_NEW_ITEM = "nuevo_item";


// Global variables
var GUISVG = new Object();
GUISVG.jscumm_engine = null;
GUISVG.svg_ready = false;
GUISVG.scroll_items = 0;
GUISVG.characters_in_scene = [];
GUISVG.scroll_characters = 0;
GUISVG.texts = [];
GUISVG.options = [];
GUISVG.entry_time_current_scene = null;
GUISVG.current_bso_file = "";
GUISVG.current_bso_sound = null;
GUISVG.languages = {};
GUISVG.current_language = 'es';

// GUI ELEMENTS NAMES
const SVG_ID_TEXT_LAYER = "#text_layer";
const SVG_ID_TEXT_LAYER_NAME = "text_layer";
const SVG_ID_CONFIG_LAYER_NAME = 'config_layer';
const SVG_ID_GUI_TEXT_LAYER = '#texts_gui_';
const SVG_ID_ROOT_NODE = "#svg_root";
const SVG_ID_CHARACTERS_LAYER = "#characters_layer";
const SVG_ID_ITEMS_LAYER = "#items_layer";
const SVG_ID_HIDDEN_LAYER = "#hidden_layer";
const SVG_ID_BLACK_LAYER_NAME = 'black_layer';
const SVG_ID_IMAGE_LAYER = "#image_layer";
const SVG_ID_IMAGE_LAYER_NAME = "image_layer";
const SVG_ID_LANGUAGE_SELECTION_LAYER_NAME = 'language_selection_layer';
const SVG_ID_OPTIONS_LAYER_NAME = "options_layer";
const SVG_ID_SPLASH_LAYER_NAME = "splash_layer";
const SVG_ID_SPLASH_LAYER = "#splash_layer";

const SVG_ATTR_OPTION = "option";
const SVG_ATTR_ACTION = "action";
const SVG_ATTR_CHARACTER = "character_id";
const SVG_ATTR_ITEM = "item";
const SVG_ATTR_SLOT = "slot";
const SVG_ATTR_LANGUAGE = 'language';
const SVG_VALUE_SCROLL_DIRECTION_UP = "up";
const SVG_VALUE_SCROLL_DIRECTION_DOWN = "down";

const CSS_CLASS_ACTION_SELECTED = "selected_action";
const CSS_CLASS_HIDDEN = "hidden";

const SVG_CLASS_TRANSLATABLE = ".translatable";
const SVG_CLASS_ACTION_BUTTON = ".action_button";
const SVG_CLASS_ITEM_BUTTON = ".item_button";
const SVG_CLASS_CHARACTER_BUTTON = ".character_button";
const SVG_CLASS_SCROLL_ITEMS = ".items_scroll";
const SVG_CLASS_SCROLL_CHARACTERS = ".scroll_characters";
const SVG_ID_REMOVE_IMAGE_BUTTON = "#remove_image";
const SVG_ID_ACTION_NAME_SCENE_BUTTON = "#scene_name_action";
const SVG_CLASS_SHOW_CONFIG_BUTTON = ".show_config_button";
const SVG_CLASS_HIDE_CONFIG_BUTTON = ".hide_config_button";
const SVG_CLASS_RESTART_GAME_BUTTON = ".restart_game_button";
const SVG_CLASS_CONFIRM_RESTART_BUTTON = ".confirm_restart_button";
const SVG_CLASS_CANCEL_RESTART_BUTTTON = ".cancel_restart_button";
const SVG_CLASS_ABOUT_PROJECT_BUTTON = ".about_project_button";
const SVG_CLASS_LICENSE_BUTTON = ".license_button";
const SVG_CLASS_SLOT = ".slot";
const SVG_CLASS_CONFIRM_LOAD_BUTTON = ".confirm_load_button";
const SVG_CLASS_SELECTED_GAME_TEXT = ".selected_game_text";
const SVG_ID_SELECTED_GAME_TEXT = "#selected_game_text";
const SVG_CLASS_CONFIRM_SAVE_BUTTON = ".confirm_save_button";
const SVG_CLASS_CANCEL_LOAD_SAVE_BUTTON = ".cancel_load_save_button";
const SVG_CLASS_LANGUAGE_BUTTON = ".language_button";
const SVG_CLASS_LANGUAGE_SELECTOR = ".language_selector";
const SVG_CLASS_EXIT_BUTTON = ".exit_button";
const SVG_ID_CURRENT_GAME_TEXT = '#current_game';
const SVG_ID_ACTION_TEXT = "#action_text";
const SVG_CLASS_ACTION_BACKGROUND = ".action_background";
const SVG_ID_SCENE_NAME = "#scene_name";
const SVG_ID_CHARACTER_IMAGE_TEXT_FRAME = "#image_character_text_frame";
const SVG_ID_IMAGE_FRAME_CHARACTER_TEXT = "#image_character_text";

const SVG_PREFIX_SAVE_LOAD_LAYER = "save_load_layer_";
const SVG_PREFIX_RESTART_CONFIRMATION_LAYER = 'restart_confirmation_layer_';
const SVG_PREFIX_BACKGROUND_ACTION_ID = "#background_";
const SVG_PREFIX_CHARACTER_ID = "#character_";
const SVG_PREFIX_ITEM_ID = "#item_";
const SVG_PREFIX_SLOT_ID = "#slot_";
const SVG_PREFIX_TEXT_LINE_ID = "#text_line_";
const SVG_PREFIX_ID_TEXT_OPTION = "#option_";
const SVG_PREFIX_ID_CONFIG_LAYER = "#config_layer_"

const SVG_SELECTOR_LINES_CHARACTER_NAME = ".character_name tspan";
const SVG_SELECTOR_TEXT_LINES = '#text_lines tspan';
const SVG_SELECTOR_TEXT_OPTIONS = "#options_lines tspan";
const SVG_SELECTOR_IMAGE_ID_IN_IMAGE_LAYER = "#image_layer #image";
const SVG_SELECTOR_CHARACTERS_IN_IMAGE = "#image_layer #image .character_button";
const SVG_SELECTOR_SPLASH_ID_IN_SPLASH_LAYER = "#splash_layer #splash";





GUISVG.init = function (engine) {
	GUISVG.jscumm_engine = engine;
	log.info("(GUISVG.init) jscumm_engine initialized.");
	engine.gui = GUISVG;
	$('#gui').height($(document).height() - BANNER_HEIGHT);
	$(window).trigger('resize');
	log.info("(GUISVG.init) Gui of the jscumm_engine initialized with this GUI type (GUISVG)");
	var gui_route = GUI_DIRECTORY + GUI_FILE;
	GUISVG.current_language = GUISVG.define_language();
	var language_route = LANG_DIRECTORY + GUISVG.current_language + '.json';
	try {
		$.getJSON(language_route, function (json) {
			GUISVG.languages = json;
			$("#gui").svg({
			loadURL: gui_route,
			onLoad: function(){
				
				GUISVG.assign_behaviour_svg();
				GUISVG.set_language_gui();
				GUISVG.svg_ready = true;
				GUISVG.jscumm_engine.init_game();
			}
			});
		});
	} catch (error) {
		log.error("(GUISVG.init) Error initializing the SVG GUI.");
		log.error(error);
	}
};

// If there is a language defined by the user, returns it.
// Else, tries to detect it automatically.
// If cannot detect it, returns English.
GUISVG.define_language = function(){
	log.debug("(GUISVG.define_language) Defines language of the game.");
	if (GUISVG.jscumm_engine.memory.user_lang != undefined){
		log.info("(GUISVG.define_language) Language initialized by the one choosen by the user: " + GUISVG.jscumm_engine.memory.user_lang );
		return (GUISVG.jscumm_engine.memory.user_lang);
	} else{
		var browser_language = navigator.language;
		if (browser_language.includes('es') == true){
			log.info("(GUISVG.define_language) Browswer language is Spanish: es");
			return ('es');
		} else{
			log.info("(GUISVG.define_language) The language not recognized and is set by default (English): en");
			return ('en');
		}
	}
};

// Function for the translation of languages
GUISVG._ = function(text){
	log.debug("(GUISVG._) Translating the following text: " + text);
	var trasnlated_text = GUISVG.languages[text];
	if (trasnlated_text == undefined){
		log.warning("[_](GUISVG._) Translation not found for this text: " + text);
		return(text);
	}else {
		return(trasnlated_text);
	}
};

GUISVG.remove_language = function(){
	log.debug("(GUISVG.remove_language) Hide the translatable layers of the GUI.");
	$(SVG_CLASS_TRANSLATABLE).css('opacity',0);
};

// Configure the needed things to put the GUI in the current language
GUISVG.set_language_gui = function(){
	log.debug("(GUISVG.set_language_gui) Set the GUI in the current language: " + GUISVG.current_language);
	GUISVG.remove_language();
	var language_route = LANG_DIRECTORY + GUISVG.current_language + '.json';
	try {
		$.getJSON(language_route, function (json) {
			GUISVG.languages = json;
			GUISVG.jscumm_engine.put_default_action();
			if (GUISVG.jscumm_engine.escene != null){
				GUISVG.show_scene(GUISVG.jscumm_engine.escene);
			}
		});
	} catch (error) {
		log.error("(JSCUMM.set_language_gui) Error setting the language of the GUI.");
		log.error(error);
	}
	
	// Show the corresponding action text layer of the GUI 
	$(SVG_ID_GUI_TEXT_LAYER + GUISVG.current_language).css('opacity', '100');
	$(SVG_PREFIX_ID_CONFIG_LAYER + GUISVG.current_language).css('opacity', '100');
};

// All the elements of the scene SVG that has the class 'character_button' are characters of the scene
// They all has the property 'character' with the id of the character
GUISVG.assign_characters_behaviour = function () {
	try {
		var character_id = $(this).attr(SVG_ATTR_CHARACTER);
		log.debug("(GUISVG.assign_characters_behaviour) Clicked the button of the character ('" + character_id + "').");
		var character = search(GUISVG.jscumm_engine.escene.characters, 'id', character_id);
		if (character != null) {
			log.trace("(GUISVG.assign_characters_behaviour) Recovered from the engine this character ('" + JSON.stringify(character) + "').");
			GUISVG.jscumm_engine.event_object(character);
		} else {
			log.warning("(GUISVG.assign_characters_behaviour) Character not found with this id: ('" + character_id + "').");
		}
	} catch (error) {
		log.error("(JSCUMM.assign_characters_behaviour) Error clicking the buton of the character.");
		log.error(error);
	}
};

GUISVG.assign_behaviour_svg = function () {
	// All the elements of the GUI SVG with the class 'action_button' are actions
	// They all have the property 'action' with the id of the action
	$(SVG_CLASS_ACTION_BUTTON).click(function () {
		try {
			var action_id = $(this).attr(SVG_ATTR_ACTION);
			log.debug("(GUISVG.assign_behaviour_svg.actions) Click in the button of the action ('" + action_id + "').");
			var action = search(GUISVG.jscumm_engine.actions, 'id', action_id);
			if (action != null) {
				log.trace("(GUISVG.assign_behaviour_svg.actions) Recovered this action from the engine ('" + JSON.stringify(action) + "').");
				GUISVG.jscumm_engine.event_action(action);
			} else {
				log.warning("(GUISVG.assign_behaviour_svg.actions) Action not found with id: ('" + action_id + "').");
			}
		} catch (error) {
			log.error("(GUISVG.assign_behaviour_svg.actions) Error while click in action button.");
			log.error(error);
		}
	});

	// All the elements of the GUI SVG with the class 'item_button' are items
	// They all have the property 'item' with the id of the item
	$(SVG_CLASS_ITEM_BUTTON).click(function () {
		try {
			var item_id = $(this).attr('item');
			log.debug("(GUISVG.assign_behaviour_svg.items) Click in the button of the item ('" + item_id + "').");
			var item = search(GUISVG.jscumm_engine.items, 'id', item_id);
			if (item != null) {
				log.trace("(GUISVG.assign_behaviour_svg.items) Recovered this item from the engine ('" + JSON.stringify(item) + "').");
				GUISVG.jscumm_engine.event_object(item);
			} else {
				log.warning("(GUISVG.assign_behaviour_svg.items) Item not found with id ('" + item_id + "').");
			}
		} catch (error) {
			log.error("(GUISVG.assign_behaviour_svg.items) Error while click in item button.");
			log.error(error);
		}
	});

	$(SVG_CLASS_CHARACTER_BUTTON).click(GUISVG.assign_characters_behaviour);

	// This elemens has the class 'scroll_items'
	// They all have a property 'scroll' that can be 'up' or 'down'
	$(SVG_CLASS_SCROLL_ITEMS).click(function () {
		try {
			var scroll_direction = $(this).attr("scroll");
			log.debug("(GUISVG.assign_behaviour_svg.scroll_item) Items scroll button clicked ('" + scroll_direction + "').");
			if (scroll_direction == SVG_VALUE_SCROLL_DIRECTION_UP) {
				GUISVG.change_items_scroll(-1);
			} else if (scroll_direction == SVG_VALUE_SCROLL_DIRECTION_DOWN) {
				GUISVG.change_items_scroll(1);
			} else {
				log.warning("(GUISVG.assign_behaviour_svg.scroll_item) Cannot identify the modification in the items scroll.");
			}
		} catch (error) {
			log.error("(GUISVG.assign_behaviour_svg.scroll_item) Error clicking the items scroll button.");
			log.error(error);
		}
	});
	GUISVG.update_inventory();

	// This elemens has the class 'scroll_characters'
	// They all have a property 'scroll' that can be 'up' or 'down'
	$(SVG_CLASS_SCROLL_CHARACTERS).click(function () {
		try {
			var scroll_direction = $(this).attr("scroll");
			log.debug("(GUISVG.assign_behaviour_svg.scroll_characters) Characters scroll button clicked ('" + scroll_direction + "').");
			if (scroll_direction == SVG_VALUE_SCROLL_DIRECTION_UP) {
				GUISVG.change_characters_scroll(-1);
			} else if (scroll_direction == SVG_VALUE_SCROLL_DIRECTION_DOWN) {
				GUISVG.change_characters_scroll(1);
			} else {
				log.warning("(GUISVG.assign_behaviour_svg.scroll_characters) Cannot identify the modification in the characters scroll.");
			}
		} catch (error) {
			log.error("(GUISVG.assign_behaviour_svg.scroll_characters) Error clicking the characters scroll button.");
			log.error(error);
		}
	});
	
	// The layer with ID 'splash_layer' of the GUI SVG is the container of the splash images
	// When clicked, the splash image disappears
	$(SVG_ID_SPLASH_LAYER).click(function () {
		GUISVG.remove_image_splash();
	});

	// The layer with Id 'text_layer' in the GUI SVG is the container of the texts
	// When clicked, shows the next texts. 
	$(SVG_ID_TEXT_LAYER).click(function () {
		GUISVG.show_next_text();
	});

	GUISVG.clean_sentences();

	// In the GUI SVG, the element with id 'options_text' is the container of the
	// options that the player can choose in conversations. It has different spans 
	// each of them with the attribute 'option' that is the index of the option selected
	// Possible values of the 'option' attribute are from 0 to the max numbre of options - 1
	$(SVG_SELECTOR_TEXT_OPTIONS).click(function () {
		try {
			var option_number = $(this).attr(SVG_ATTR_OPTION);
			log.debug("(GUISVG.assign_behaviour_svg.seleccion_opcion) It has been selected the option number: ('" + option_number + "').");
			var selected_action_commands = GUISVG.options[0][option_number].coms;
			// At the end of the commands a pause is introduced to choose a new option when ended the execution
			selected_action_commands.push(PAUSE_COMMAND);
			GUISVG.jscumm_engine.stack_commands(selected_action_commands);
			GUISVG.jscumm_engine.continue_commands_execution();
		} catch (error) {
			log.error("(GUISVG.assign_behaviour_svg.seleccion_opcion) Error clicking a text option.");
			log.error(error);
		}
	});

	// In the SVG GUI, the element with ID 'remove_image' removes the image of the scene
	// letting the GUI bottom layer to be seen
	$(SVG_ID_REMOVE_IMAGE_BUTTON).click(function(){
		GUISVG.play_sound(SOUND_PAPER);
		GUISVG.remove_image();
	});

	// In the SVG GUI, the element with ID 'action_name_scene' shows again
	// the image of the current scene
	$(SVG_ID_ACTION_NAME_SCENE_BUTTON).click(function () {
		GUISVG.play_sound(SOUND_PAPER);
		GUISVG.show_image(GUISVG.jscumm_engine.escene.image);
	});
	
	// In the SVG GUI, the element with class 'show_config_button' shows
	// the configurations layers of the GUI, defined by id 'config_layer' (background)
	// and id 'config_layer_[language_code]' for the buttons and texts layer
	$(SVG_CLASS_SHOW_CONFIG_BUTTON).click(function (){
		GUISVG.update_slots();
		GUISVG.layer_to_top(SVG_ID_CONFIG_LAYER_NAME);
		GUISVG.layer_to_top(SVG_ID_CONFIG_LAYER_NAME + "_" + GUISVG.current_language);
	});

	// In the SVG GUI, the element with class 'hide_config_button' hides
	// the configurations layers of the GUI.
	$(SVG_CLASS_HIDE_CONFIG_BUTTON).click(function (){
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME + "_" + GUISVG.current_language);
	});
	
	// In the SVG GUI, the element with class 'restart_game_button' shows
	// the layer of confirmation of game restart 
	// with id 'restart_confirmation_layer_[language_code]'
	$(SVG_CLASS_RESTART_GAME_BUTTON).click(function (){
		GUISVG.layer_to_top(SVG_PREFIX_RESTART_CONFIRMATION_LAYER + GUISVG.current_language);
	});
	
	// In the SVG GUI, the buttons with class 'confirm_restart_button' 
	// triggers the restart of the game.
	$(SVG_CLASS_CONFIRM_RESTART_BUTTON).click(function (){
		GUISVG.jscumm_engine.restart_game();
		GUISVG.layer_to_bottom(SVG_PREFIX_RESTART_CONFIRMATION_LAYER + GUISVG.current_language);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME + '_' + GUISVG.current_language);
	});
	
	// In the SVG GUI, the buttons with class 'cancel_restart_button' 
	// cancels the restart of the game and hides the confirmation layer.
	$(SVG_CLASS_CANCEL_RESTART_BUTTTON).click(function (){
		GUISVG.layer_to_bottom(SVG_PREFIX_RESTART_CONFIRMATION_LAYER + GUISVG.current_language);
	});
	
	// In the SVG GUI, the buttons with class 'about_project_button' 
	// opens the web page of the project.
	$(SVG_CLASS_ABOUT_PROJECT_BUTTON).click(function (){
		log.info("(GUISVG.about_project_button) Redirecting to the project site: " + PROJECT_PAGE);
		window.location.href = PROJECT_PAGE;
	});

	// In the SVG GUI, the buttons with class 'license_button' 
	// opens the web license information of the project.
	$(SVG_CLASS_LICENSE_BUTTON).click(function (){
		log.info("(GUISVG.license_button) Redirecting to the project license page: " + LICENSE_PAGE);
		window.location.href = LICENSE_PAGE;
	});
	
	// In the SVG GUI, the elements with class 'slot' are the containers
	// of the saved games. All of them have an attribute 'slot' with the
	// index of the game saved (from 0 to max slots -1)
	$(SVG_CLASS_SLOT).click(function(){
		var slot_text;
		var current_slot = $(this).attr(SVG_ATTR_SLOT);
		if (GUISVG.jscumm_engine.slots_saved_games[current_slot] == null){
			// If the slot is empty, hide the option 'LOAD' in the save_load_layer
			slot_text = "- Empty -";
			$(SVG_CLASS_CONFIRM_LOAD_BUTTON).addClass(CSS_CLASS_HIDDEN);
		} else{
			slot_text = 
					  GUISVG.jscumm_engine.slots_saved_games[current_slot].scene_name +
					  ", " + 
					  (GUISVG.jscumm_engine.slots_saved_games[current_slot].time_played / (1000 * 3600)).toFixed(0) +
					  "h, " + 
					  GUISVG.jscumm_engine.get_completed_game_slot(current_slot).toFixed(0) +
			"%";
			// If the selected slot is not empty, show the option 'LOAD' in the save_load_layer
			$(SVG_CLASS_CONFIRM_LOAD_BUTTON).removeClass(CSS_CLASS_HIDDEN);
		}
		// The element with class 'selected_game_text' of the 'save_load_layer[language_code]' is
		// updated with the data of the info of the selected slot.
		$(SVG_CLASS_SELECTED_GAME_TEXT).html(slot_text);
		$(SVG_CLASS_SELECTED_GAME_TEXT).attr(SVG_ATTR_SLOT,current_slot);
		GUISVG.layer_to_top(SVG_PREFIX_SAVE_LOAD_LAYER + GUISVG.current_language);
	});
	
	// In the SVG GUI, the element with class 'confirm_load_button' of the layer 
	// with id 'save_load_layer[language_code]' loads the selected saved game
	$(SVG_CLASS_CONFIRM_LOAD_BUTTON).click(function (){
		var selected_slot = $(SVG_ID_SELECTED_GAME_TEXT).attr(SVG_ATTR_SLOT);
		GUISVG.jscumm_engine.load_current_game_from_slot(selected_slot);
		GUISVG.update_slots();
		GUISVG.layer_to_bottom(SVG_PREFIX_SAVE_LOAD_LAYER + GUISVG.current_language);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME + '_' + GUISVG.current_language);
	});
	
	// In the SVG GUI, the element with class 'confirm_save_button' of the layer 
	// with id 'save_load_layer[language_code]' save the game in the selected slot
	$(SVG_CLASS_CONFIRM_SAVE_BUTTON).click(function (){
		var selected_slot = $(SVG_ID_SELECTED_GAME_TEXT).attr(SVG_ATTR_SLOT);
		GUISVG.jscumm_engine.save_current_game_in_slot(selected_slot);
		GUISVG.update_slots();
		GUISVG.layer_to_bottom(SVG_PREFIX_SAVE_LOAD_LAYER + GUISVG.current_language);
	});
	
	// In the SVG GUI, the element with class 'cancel_load_save_button' of the layer 
	// with id 'save_load_layer[language_code]' hides the layer
	$(SVG_CLASS_CANCEL_LOAD_SAVE_BUTTON).click(function (){
		GUISVG.layer_to_bottom(SVG_PREFIX_SAVE_LOAD_LAYER + GUISVG.current_language);
	});
	
	// In the SVG GUI, the element with class 'language_button' of the config layer 
	// shows the 'language_selection_layer'
	$(SVG_CLASS_LANGUAGE_BUTTON).click(function (){
		GUISVG.layer_to_top(SVG_ID_LANGUAGE_SELECTION_LAYER_NAME);
	});
	
	// In the SVG GUI, the elements with class 'language_selector' of the layer 
	// with id 'language_selection_layer' saves a language for the game. 
	// All of them have an attribute 'language' with the code of the language
	$(SVG_CLASS_LANGUAGE_SELECTOR).click(function (){
		log.info("(GUISVG.language_selector) Changing the language to: " + $(this).attr(SVG_ATTR_LANGUAGE));
		GUISVG.current_language = $(this).attr(SVG_ATTR_LANGUAGE);
		GUISVG.jscumm_engine.write_user_lang(GUISVG.current_language);
		GUISVG.layer_to_bottom(SVG_ID_LANGUAGE_SELECTION_LAYER_NAME);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME);
		GUISVG.layer_to_bottom(SVG_ID_CONFIG_LAYER_NAME + '_' + GUISVG.current_language);
		GUISVG.set_language_gui();
	});
	
	// In the SVG GUI, the elements with class 'exit_button' of the config layer 
	// exits the application in Android devices
	//TODO: Add only for android 
	$(SVG_CLASS_EXIT_BUTTON).click(function (){
		navigator.app.exitApp();
	});
};

GUISVG.restart_game = function(){
	log.info("(GUISVG.restart_game) Restarting the game.");
	GUISVG.entry_time_current_scene = null;
};


GUISVG.update_slots = function(){
	log.info("(GUISVG.update_slots) Updating the info of the game slots.");
	var hours_played = GUISVG.jscumm_engine.time_played / (3600 * 1000);
	var minutes_played = 
			(GUISVG.jscumm_engine.time_played  -
			hours_played.toFixed('0') * (3600 * 1000)) / (60 * 1000);
	var completed_game = GUISVG.jscumm_engine.get_completed_game();
	$(SVG_ID_CURRENT_GAME_TEXT).html(
			  GUISVG._("Time played") + ": " + 
			  hours_played.toFixed('0') + 
			  "h" + minutes_played.toFixed('0') + "m" +
			  ", " + GUISVG._("completed") + ": " + 
			  completed_game.toFixed('1')+ 
			  "%" );
	for (var current_slot = 1 ; current_slot <= NUMBER_SLOTS_SAVED_GAMES ; current_slot++){
		var slot_text;
		if (GUISVG.jscumm_engine.slots_saved_games[current_slot] == null){
			slot_text = "- " + "Empty";
		} else{
			slot_text = "- " +
					  GUISVG.jscumm_engine.slots_saved_games[current_slot].scene_name +
					  ", " + 
					  (GUISVG.jscumm_engine.slots_saved_games[current_slot].time_played / (1000 * 3600)).toFixed(0) +
					  "h, " + 
					  GUISVG.jscumm_engine.get_completed_game_slot(current_slot).toFixed(0) +
			"%";
		}
		$(SVG_PREFIX_SLOT_ID + current_slot + " tspan").html(slot_text);
	}
};

GUISVG.update_current_action = function (action) {
	log.debug("(GUISVG.update_current_action) Updating current action: " + action.id);
	log.trace("(GUISVG.update_current_action) Updating current action: " + JSON.stringify(action));
	var translated_text = GUISVG._(action.text);
	$(SVG_ID_ACTION_TEXT).text(translated_text);
	
	// Selected is highlighted
	$(SVG_CLASS_ACTION_BACKGROUND).removeClass(CSS_CLASS_ACTION_SELECTED);
	$(SVG_PREFIX_BACKGROUND_ACTION_ID + action.id).addClass(CSS_CLASS_ACTION_SELECTED);
};

GUISVG.update_current_object = function (object, dative) {
	log.debug("(GUISVG.update_current_object) Updating current object: " + object.id);
	log.trace("(GUISVG.update_current_object) Updating current object: " + JSON.stringify(object));
	
	var current_action_text = $(SVG_ID_ACTION_TEXT).text();
	var translated_object = GUISVG._(object.name);
	current_action_text += " " + translated_object;
	if ((dative == false) && (GUISVG.jscumm_engine.current_action.dative == true)) {
		var translated_preposition = GUISVG._(GUISVG.jscumm_engine.current_action.preposition);
		current_action_text += " " + translated_preposition;
	}
	$(SVG_ID_ACTION_TEXT).text(current_action_text);
};


GUISVG.layer_to_top = function (layer_id) {
	$('#' + layer_id).css('opacity', '100');
	$('#' + layer_id).appendTo(SVG_ID_ROOT_NODE);
};

GUISVG.layer_to_bottom = function (layer_id) {
	$('#' + layer_id).css('opacity', '0');
	$('#' + layer_id).prependTo(SVG_ID_ROOT_NODE);
};

GUISVG.show_scene = function (scene) {
	log.debug("(GUISVG.show_scene) Show scene: " + scene.name);
	log.trace("(GUISVG.show_scene) Show scene: " + JSON.stringify(scene));
	
	if ($(SVG_ID_SCENE_NAME + " tspan").length == 0){
		log.warning("(GUISVG.show_scene) Waiting for the svg to load to show the scene.");
		//return(false);
	}
	
	// Remove the current image in case there is one
	GUISVG.remove_image();
	
	// Update the name of the scene
	var translated_scene_name = GUISVG._(scene.name);
	var scene_name_lines = wordwrap(translated_scene_name, MAX_CHARS_SCENE_NAME_LINE, "#").split("#");
	var scene_name_lines_containers = $(SVG_ID_SCENE_NAME + " tspan");
	// Clean the content of the lines of the scene name
	$(scene_name_lines_containers).html("");
	for (var current_scene_name_line = 0; 
				current_scene_name_line < SCENE_NAME_LINES; 
				current_scene_name_line++) {
		$(scene_name_lines_containers[current_scene_name_line]).text(scene_name_lines[current_scene_name_line]);
	}

	GUISVG.characters_in_scene = [];
	for (var characters_index = 0;
			  	characters_index < GUISVG.jscumm_engine.escene.characters.length;
			  	characters_index++) {
		// If the character has an image, appears in the notebook
		if (GUISVG.jscumm_engine.escene.characters[characters_index].image != undefined) {
			// If the condition for the image of the character is true
			if (GUISVG.jscumm_engine.eval_condition(
					  GUISVG.jscumm_engine.escene.characters[characters_index].cond_imagen)) {
				GUISVG.characters_in_scene.push(
						  GUISVG.jscumm_engine.escene.characters[characters_index]);
			}
		}
	}
	GUISVG.scroll_characters = 0;
	GUISVG.update_characters();
	GUISVG.show_image(GUISVG.jscumm_engine.escene.image);
	
	if (scene.bso != undefined){
		GUISVG.change_bso(scene.bso);
	}
	
	// Updates the playing time and the entry timestamp for this scene
	var current_time = new Date();
	if (GUISVG.entry_time_current_scene != null){
		var time_in_scene = current_time - GUISVG.entry_time_current_scene;
		GUISVG.jscumm_engine.time_played += time_in_scene;
	}
	GUISVG.entry_time_current_scene = current_time;
	GUISVG.jscumm_engine.save_current_game()
	GUISVG.layer_to_bottom(SVG_ID_BLACK_LAYER_NAME);
	return (true);
};

// Changes the new current scroll and update the characters
GUISVG.change_characters_scroll = function (scroll_change) {
	var proposed_scroll = GUISVG.scroll_characters + scroll_change;
	try {
		if (proposed_scroll < 0) {
			log.debug("(GUISVG.change_characters_scroll) Current characters scroll is 0. Cannot be lower.");
		} else if (GUISVG.characters_in_scene.length / (proposed_scroll * NUMBER_CHARACTERS_GUI) <= 1) {
			log.debug("(GUISVG.change_characters_scroll) Current characters scroll is the maximum. Cannot be higher");
		} else {
			log.debug("(GUISVG.change_characters_scroll) Changed the current characters scroll to: " + proposed_scroll);
			GUISVG.scroll_characters = proposed_scroll;
			GUISVG.update_characters();
		}
	} catch (error) {
		log.error("(GUISVG.change_characters_scroll) Error changing the scroll of the characters.");
		log.error(error);
	}
};

// Makes a character visible in the GUI
GUISVG.put_character = function (character_id) {
	log.debug("(GUISVG.put_character) Put character: " + character_id);
	try {
		var character = search(GUISVG.jscumm_engine.escene.characters,"id",character_id);
		if (character == null){
			log.error("(GUISVG.put_character) The ID '" + character_id +  "' of the character is not found in the scene.");
			return(false);
		}
		// Update the characters in the notebook
		// - If the character has image, appears in the notebook
		// - The image appears only if the cond_img is evaluated as true
		if (character.image != undefined){
			if (search(GUISVG.characters_in_scene, "id", character.id) != null) {
				log.warning("(GUISVG.put_character) The character is already in scene.");
			} else {
					log.debug("(GUISVG.put_character) The character is no in scene.");
					GUISVG.characters_in_scene.push(character);
					GUISVG.update_characters();
					GUISVG.play_sound(SOUND_PENCIL);
			}
		}
		// Update the characters shown in the scene.
		var character_image = $(SVG_ID_IMAGE_LAYER + 
								" [" + SVG_ATTR_CHARACTER +
								"='" + character_id + "']");
		$(character_image).removeClass(CSS_CLASS_HIDDEN);
	} catch (error) {
		log.error("(GUISVG.put_character) Error putting the chatacter in the GUI.");
		log.error(error);
	}
};

// Hide a character in the GUI
GUISVG.remove_character = function (character_id) {
	log.debug("(GUISVG.remove_character) Remove character: " + character_id);
	try {
		// Removes a character from the notebook
		if (search(GUISVG.characters_in_scene, "id", character_id) == null) {
			log.warning("(GUISVG.remove_character) Trying to remove a character that was already not in the scene: " + character_id);
		} else {
			for (var index_character_to_remove = 0;
					  (GUISVG.characters_in_scene[index_character_to_remove].id != character_id)
					  && (index_character_to_remove < GUISVG.characters_in_scene.length);
					  index_character_to_remove++)
				;
			GUISVG.characters_in_scene.splice(index_character_to_remove, 1);
			GUISVG.update_characters();
		}
		// Removes the character from the snece if it was shown. 
		var character_image = $(SVG_ID_IMAGE_LAYER + 
								" [" + SVG_ATTR_CHARACTER +
								"='" + character_id + "']");
		$(character_image).addClass(CSS_CLASS_HIDDEN);
	} catch (error) {
		log.error("(GUISVG.remove_character) Error putting the chatacter in the GUI.");
		log.error(error);
	}
};


// Shows the characters of the notebook acording to the current scroll of the GUI
GUISVG.update_characters = function () {
	log.debug("(GUISVG.update_characters) Updates the characters shown in the GUI notebook");
	try {
		// Remove all the text lines with characters names
		$(SVG_SELECTOR_LINES_CHARACTER_NAME).text("");
		var character_index = GUISVG.scroll_characters * NUMBER_CHARACTERS_GUI;
		var visible_chatacters = [];
		for (var max_characters = 0;
				  (max_characters < NUMBER_CHARACTERS_GUI) && 
				  (character_index < GUISVG.characters_in_scene.length);
				  max_characters++, character_index++) {
			visible_chatacters.push(GUISVG.characters_in_scene[character_index]);
		}
		log.trace("(GUISVG.update_characters) This characters are shown in the notebook: " + JSON.stringify(visible_chatacters));
		// Move all the containers of characters to the hidden layer 
		$(SVG_ID_CHARACTERS_LAYER + " " +SVG_CLASS_CHARACTER_BUTTON).appendTo(SVG_ID_HIDDEN_LAYER);
		// For each character in the list of visible characters, 
		// put it in the characters container and move it to characters layer
		for (var character_to_show = 0; 
			character_to_show < visible_chatacters.length; 
			character_to_show++) {
			var current_character = visible_chatacters[character_to_show];
			log.trace("(GUISVG.update_characters) Putting this character in the container: " + current_character.id);
			var image_route = CHARACTERS_IMAGES_DIRECTORY + current_character.image;
			$(SVG_PREFIX_CHARACTER_ID + character_to_show + " image").attr("xlink:href", image_route);
			$(SVG_PREFIX_CHARACTER_ID + character_to_show).attr(SVG_ATTR_CHARACTER, current_character.id);
			// Calculate the lines of the character name
			var translated_character_name = GUISVG._(current_character.name);
			var character_name_text_lines = wordwrap(translated_character_name, MAX_CHARS_CHARACTER_LINE, "#").split("#");
			var current_character_lines_containers = $(SVG_PREFIX_CHARACTER_ID +
					  character_to_show + " " +
					  SVG_SELECTOR_LINES_CHARACTER_NAME);
			for (var current_character_name_line = 0; 
				current_character_name_line < CHARACTER_LINES; 
				current_character_name_line++) {
				$(current_character_lines_containers[current_character_name_line]).text(character_name_text_lines[current_character_name_line]);
			}
			// Move the character to the characters layer so it can be seen
			$(SVG_PREFIX_CHARACTER_ID + character_to_show).appendTo(SVG_ID_CHARACTERS_LAYER);
		}
	} catch (error) {
		log.error("(GUISVG.update_characters) Error updating characters notebook.");
		log.error(error);
	}
};

// Change the current items scroll and update the inventory
GUISVG.change_items_scroll = function (scroll_change) {
	var proposed_scroll = GUISVG.scroll_items + scroll_change;
	try {
		if (proposed_scroll < 0) {
			log.debug("(GUISVG.change_items_scroll) Current items scroll is 0. Cannot be lower.");
		} else if (GUISVG.jscumm_engine.inventory.length / (proposed_scroll * NUMBER_ITEMS_GUI) <= 1) {
			log.debug("(GUISVG.change_items_scroll) Current items scroll is the maximum. Cannot be higher.");
		} else {
			log.debug("(GUISVG.change_items_scroll) Changed the current items scroll to: " + proposed_scroll);
			GUISVG.scroll_items = proposed_scroll;
			GUISVG.update_inventory();
			GUISVG.play_sound(SOUND_ITEMS);
		}
	} catch (error) {
		log.error("(JSCUMM.cambia_scroll_items) Error while updating the scroll of the items.");
		log.error(error);
	}
};

// Shows the items of the iventory acording to the current scroll of the GUI
GUISVG.update_inventory = function () {
	log.debug("(GUISVG.update_inventory) Updates the inventory in the GUI: " + JSON.stringify(JSCUMM.inventory));
	try {
		var item_index = GUISVG.scroll_items * NUMBER_ITEMS_GUI;
		var visible_items = [];
		for (var max_items = 0;
				  (max_items < NUMBER_ITEMS_GUI) && (item_index < GUISVG.jscumm_engine.inventory.length);
				  max_items++, item_index++) {
			visible_items.push(GUISVG.jscumm_engine.inventory[item_index]);
		}
		log.debug("(GUISVG.update_inventory) Showing this items from the inventory: " + visible_items);
		// Move all to the hidden layer
		$(SVG_CLASS_ITEM_BUTTON).appendTo(SVG_ID_HIDDEN_LAYER);
		// For each item in the list of visible items, 
		// put it in the items container and move it to items layer
		for (var item_to_show = 0; item_to_show < visible_items.length; item_to_show++) {
			var current_item = search(
					  GUISVG.jscumm_engine.items,
					  "id",
					  visible_items[item_to_show]);
			log.trace("(GUISVG.update_inventory) Putting in the container this item: " + JSON.stringify(current_item));
			var image_route = ITEMS_IMAGES_DIRECTORY + current_item.image;
			$(SVG_PREFIX_ITEM_ID + item_to_show).attr("xlink:href", image_route);
			$(SVG_PREFIX_ITEM_ID + item_to_show).attr(SVG_ATTR_ITEM, current_item.id);
			$(SVG_PREFIX_ITEM_ID + item_to_show).appendTo(SVG_ID_ITEMS_LAYER);
		}
	} catch (error) {
		log.error("(GUISVG.update_inventory) Error updating inventory.");
		log.error(error);
	}
};

GUISVG.take_item = function() {
	log.debug("(GUISVG.take_item) Updates the inventory with the new item GUI: " + JSON.stringify(JSCUMM.inventory));
	GUISVG.update_inventory();
	GUISVG.play_sound(SOUND_NEW_ITEM);
};

// Currently, no action is made. A sound could be played, maybe...
GUISVG.take_flag = function (flag) {
	log.debug("(GUISVG.take_flag) Take flag in GUI: " + flag);
};

// Currently, no action is made. A sound could be played, maybe...
GUISVG.leave_flag = function (flag) {
	log.debug("(GUISVG.leave_flag) Remove flag in GUI: " + flag);
};

GUISVG.new_text = function (texts) {
	for (var index = 0; index < texts.length; index++) {
		log.debug("(GUISVG.new_text) Print the text in the GUI: '" + texts[index] + "'");
		GUISVG.texts.push(texts[index]);
	}
	GUISVG.layer_to_top(SVG_ID_TEXT_LAYER_NAME);
	GUISVG.show_next_text();
};


GUISVG.clean_sentences = function () {
	$(SVG_SELECTOR_TEXT_LINES).text("");
};

// Shows the image of the character depending on the first line of the text passed as parameter
// If the line does not match any of the configs or is empty, the frame is hidden
GUISVG.show_image_character_text = function(first_line){
	log.debug("(GUISVG.show_image_character_text) Showing the image of the character with this text:" + first_line);
	if ((first_line == undefined) || (first_line == "")){
		log.debug("(GUISVG.show_image_character_text) Lina not defined or empty. Hiding the frame.");
		$(SVG_ID_CHARACTER_IMAGE_TEXT_FRAME).addClass(CSS_CLASS_HIDDEN);
	} else {
		var image = GUISVG.jscumm_engine.config["text_images"][first_line];
		if (image == undefined){
			log.debug("(GUISVG.show_image_character_text) The line is not found in the config file. Hiding the frame.");
			$(SVG_ID_CHARACTER_IMAGE_TEXT_FRAME).addClass(CSS_CLASS_HIDDEN);
		} else{
			log.debug("(GUISVG.show_image_character_text) Line found in config file. NAme of teh image: " + image);
			$(SVG_ID_IMAGE_FRAME_CHARACTER_TEXT).attr("xlink:href", image);
			$(SVG_ID_CHARACTER_IMAGE_TEXT_FRAME).removeClass(CSS_CLASS_HIDDEN);
		}
	}
};


// If there are texts to show, take the first and show it stoping the exec of JSCUMM commands
// If there are no more texts, clean the texts, hide the text layer and continue exec of JSCUMM commands
GUISVG.show_next_text = function () {
	GUISVG.clean_sentences();
	if (GUISVG.texts.length > 0) {
		var untranslated_text = GUISVG.texts.shift();
		var translated_text = GUISVG._(untranslated_text);
		log.debug("(GUISVG.show_next_text) Showing this text:" + translated_text);
		var lines = [];
		var untraslated_lines = untranslated_text.split("#");
		var translated_lines = translated_text.split("#");
		GUISVG.show_image_character_text(untraslated_lines[0]);
		for (var lines_index = 0; lines_index < translated_lines.length; lines_index++) {
			var splitted_lines = wordwrap(translated_lines[lines_index],
					  MAX_CHARS_TEXT_LINE,
					  "#").split("#");
			lines = lines.concat(splitted_lines);
		}
		log.debug("(GUISVG.show_next_text) Lines to show: " + lines);
		for (var line_number = 0; line_number < TEXT_LINES; line_number++) {
			var current_line = lines.shift();
			$(SVG_PREFIX_TEXT_LINE_ID + line_number).text(current_line);
		}
		// If there is any line left, stack it before the otehr new texts
		if (lines.length > 0) {
			log.debug("(GUISVG.show_next_text) There are these lines to show later: " + lines);
			GUISVG.texts = lines.concat(GUISVG.texts);
		}
		GUISVG.jscumm_engine.stop_command_execution();
	} else {
		// No new texts to show
		log.debug("(GUISVG.show_next_text) Stop showing texts and hide the text layer.");
		GUISVG.clean_sentences();
		GUISVG.show_image_character_text("");
		GUISVG.layer_to_bottom(SVG_ID_TEXT_LAYER_NAME);
		GUISVG.jscumm_engine.continue_commands_execution();
	}
};

GUISVG.new_options = function (options) {
	log.debug("(GUISVG.new_options) Showing the options.");
	log.trace("(GUISVG.new_options) Showing the options: " + JSON.stringify(options));
	// Stacking the options of the selected action
	GUISVG.options.unshift(options);
	log.debug("(GUISVG.options) Staking the commands of teh selected action");
	GUISVG.layer_to_top(SVG_ID_OPTIONS_LAYER_NAME);
	GUISVG.show_next_options();
};


GUISVG.clean_options = function () {
	$(SVG_SELECTOR_TEXT_OPTIONS).text("");
};


// If there are options to show, show the firsts and stop the exec of JSCUMM commands
// If there are no more options, clean all options, hide the options layer 
// and continue exec of JSCUMM commands
// An option is shown if the condition if evaluated true
GUISVG.show_next_options = function () {
	log.debug("(GUISVG.show_next_options) Showing options.");
	GUISVG.clean_options();
	if (GUISVG.options.length > 0) {
		var current_option = GUISVG.options[0];
		log.debug("(GUISVG.show_next_options) Showing the following options: " +
				  GUISVG.options[0].txt + "[...]");
		for (var option_index = 0, text_index = 0;
				  (text_index < OPTIONS_LINES) && (option_index < current_option.length);
				  option_index++) {
			if (GUISVG.jscumm_engine.eval_condition(current_option[option_index].cond)) {
				var translated_text = GUISVG._(current_option[option_index].txt);
				$(SVG_PREFIX_ID_TEXT_OPTION + text_index).text((text_index + 1) +
						  ". " +
						  translated_text);
				$(SVG_PREFIX_ID_TEXT_OPTION + text_index).attr(SVG_ATTR_OPTION, option_index);
				text_index++;
			}
		}
		GUISVG.jscumm_engine.stop_command_execution();
	} else {
		// No options to show
		log.debug("(GUISVG.show_next_options) Ended showing options and hide the options layer.");
		GUISVG.clean_options();
		GUISVG.layer_to_bottom(SVG_ID_OPTIONS_LAYER_NAME);
		GUISVG.jscumm_engine.continue_commands_execution();
	}
};

GUISVG.remove_options = function () {
	log.debug("(GUISVG.remove_options) Going out from the current options.");
	// Unstack the current options
	GUISVG.options.shift();
	GUISVG.show_next_options();
};

GUISVG.exit_options = function () {
	log.debug("(GUISVG.exit_options) Exiting the options menu.");
	// Remove all the options
	GUISVG.options = [];
	GUISVG.show_next_options();
};


// The ID of the SVG loaded must be 'image', else will not be loaded
// The name of the image is translated so there can be different images for languages
GUISVG.show_image = function (image) {
	log.debug("(GUISVG.show_image) Showing image:" + GUISVG._(image));
	var image_route = IMAGES_DIRECTORY + GUISVG._(image);
	$(SVG_SELECTOR_IMAGE_ID_IN_IMAGE_LAYER).svg({
		loadURL: image_route,
		onLoad: function () {
			log.debug("(GUISVG.show_image) Adding the transformation attribute in the element to locate it properly");
			$(SVG_SELECTOR_IMAGE_ID_IN_IMAGE_LAYER).attr("transform", "translate(" +
					  IMAGE_HORIZONTAL_POSITION +
					  "," +
					  IMAGE_VERTICAL_POSITION +
					  ")");
			$(SVG_SELECTOR_IMAGE_ID_IN_IMAGE_LAYER + " " + SVG_CLASS_CHARACTER_BUTTON)
				.click(GUISVG.assign_characters_behaviour);
			GUISVG.hide_show_characters_image();
			GUISVG.layer_to_top(SVG_ID_IMAGE_LAYER_NAME);
			
			// If there was a text, put the text layer on top again
			var penultimate_layer = $("svg > g");
			if (penultimate_layer[penultimate_layer.length - 2].id == SVG_ID_TEXT_LAYER_NAME){
				log.debug("(GUISVG.show_image) Putting the text layer on top again.");
				GUISVG.layer_to_top(SVG_ID_TEXT_LAYER_NAME);
			}
		}
	});
};

GUISVG.remove_image = function () {
	GUISVG.layer_to_bottom(SVG_ID_IMAGE_LAYER_NAME);
};


// The ID of the SVG loaded must be 'splash', else will not be loaded
// The name of the image is translated so there can be different images for languages
GUISVG.show_splash_image = function (image) {
	log.debug("(GUISVG.show_splash_image) Showing the splash image:" + GUISVG._(image));
	var image_route = SPLASH_IMAGES_DIRECTORY + GUISVG._(image);
	$(SVG_SELECTOR_SPLASH_ID_IN_SPLASH_LAYER).svg({
		loadURL: image_route,
		onLoad: function () {
			log.debug("(GUISVG.show_splash_image) Adding the transformation attribute in the element to locate it properly");
			$(SVG_SELECTOR_SPLASH_ID_IN_SPLASH_LAYER).attr("transform", "translate(" +
					  SPLASH_IMAGE_HORIZONTAL_POSITION +
					  "," +
					  SPLASH_IMAGE_VERTICAL_POSITION +
					  ")");
			GUISVG.layer_to_top(SVG_ID_SPLASH_LAYER_NAME);
			$(SVG_SELECTOR_SPLASH_ID_IN_SPLASH_LAYER).removeClass('hasSVG');
		}
	});
};

GUISVG.remove_image_splash = function () {
	GUISVG.layer_to_bottom(SVG_ID_SPLASH_LAYER_NAME);
};

// Hide or show characters in the image depending on the conditions of each character
GUISVG.hide_show_characters_image = function () {
	log.debug("(GUISVG.hide_show_characters_image) Hide or show characters in the image.");
	var characters_list = $(SVG_SELECTOR_CHARACTERS_IN_IMAGE);
	for (var character_index = 0; character_index < characters_list.length; character_index++) {
		var id_character = $(characters_list[character_index]).attr(SVG_ATTR_CHARACTER);
		var character = search(GUISVG.jscumm_engine.escene.characters, 'id', id_character);
		if (character == null) {
			log.error("(GUISVG.hide_show_characters_image) The character with id:'" + id_character + "' is not defined in the scene config file.");
		} else {
			if (GUISVG.jscumm_engine.eval_condition(character.cond)) {
				$(characters_list[character_index]).removeClass(CSS_CLASS_HIDDEN);
			} else {
				$(characters_list[character_index]).addClass(CSS_CLASS_HIDDEN);
			}
		}
	}
};

GUISVG.change_bso = function(file){
	log.debug("(GUISVG.change_bso) Change the BSO for another: " + file);
	if (GUISVG.current_bso_file == ""){
		// There is not previos bso playing. 
		GUISVG.current_bso_sound = new buzz.sound( BSO_DIRECTORY + file, 
			{
				formats: [ "mp3" ]
			});
		GUISVG.current_bso_sound.play()
			.setVolume(0)
			.fadeTo(BSO_VOLUME,FADE_IN_TIME)
			.loop();
		GUISVG.current_bso_file = file;
	} else if (GUISVG.current_bso_file == file){
		log.trace("(GUISVG.change_bso) The BSO is the same. No changes.");
	} else {
		// Change the BSO
		var new_bso = new buzz.sound( BSO_DIRECTORY + file, 
			{
				formats: [ "mp3" ]
			});
		GUISVG.current_bso_sound.fadeOut(CROSS_FADE_TIME,
			function(){
				GUISVG.current_bso_sound.stop();
				GUISVG.current_bso_sound = new_bso;
				GUISVG.current_bso_sound.play().loop();
				GUISVG.current_bso_file = file;
			});
		new_bso.play()
			.fadeTo(BSO_VOLUME,CROSS_FADE_TIME)
			.loop();
	}
};

GUISVG.play_sound = function(file){
	log.info("(GUISVG.play_sound) Play the sound of the file: " + file);
	var sound = new buzz.sound( SOUNDS_DIRECTORY + file, 
			{
				formats: [ "mp3" ]
			});
	sound.setVolume(SOUND_VOLUME).play();
};

GUISVG.init_game = function () {
	JSCUMM.init(GUISVG);
	return(true);
};

$(window).load(function () {
	GUISVG.init_game();
});

