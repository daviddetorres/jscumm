/* global log, comando */

var ACTION_DIRECTORY = "chapter";
var SCENES_DIRECTORY = "chapter/scenes";
var LANGUAGES_DIRECTORY = "./chapter/languages/";
var ITEMS_DIRECTORY = "chapter";

var scenes = [
	"0_tutorial_larder",
	"0_tutorial_studio"
];

var JSCUMMtexts = new Object();

JSCUMMtexts.actions_gui = null;
JSCUMMtexts.texts = [];
JSCUMMtexts.scenes_loaded = [];
JSCUMMtexts.items_loaded = [];
JSCUMMtexts.lang_es = {};
JSCUMMtexts.current_lang = null;


log.level = "INFO";

JSCUMMtexts.add_contant_texts = function(){
	log.info("(textosJSCUMM.add_contant_texts) Adding texts in code.");
	
	JSCUMMtexts.texts.push('Time played');
	JSCUMMtexts.texts.push('completed');
	JSCUMMtexts.texts.push('Empty');
	
};

JSCUMMtexts.load_actions = function (){
	log.info("(textosJSCUMM.load_actions) Loading actions.");
	
	var actions_route = ACTION_DIRECTORY + "/actions.json";
	try {
		$.getJSON(actions_route, function (json) {
			JSCUMMtexts.actions_gui = json;
		})
		.error(function(XMLHttpRequest, textStatus, errorThrown){
			log.error("(textosJSCUMM.load_actions) Error loading actions configuration.");
			log.error("(textosJSCUMM.load_actions) TextStatus" + textStatus);
			log.error("(textosJSCUMM.load_actions) ErrorThrown" + errorThrown);
		});
	} catch (error) {
		log.error("(textosJSCUMM.load_actions) Error loading actions configuration.");
		log.error(error);
	} 
};

JSCUMMtexts.load_languages = function(){
	log.info("(textosJSCUMM.load_languages) Loading langauge 'es'.");
	$.getJSON(LANGUAGES_DIRECTORY + "es.json", function (json) {
			JSCUMMtexts.lang_es = json;
		});
};

JSCUMMtexts.add_text = function (text){
	log.debug("(JSCUMMtexts.add_text) Trying to add text: " + text);
	if (JSCUMMtexts.texts.indexOf(text) == -1){
		log.debug("(JSCUMMtexts.add_text) Text added: " + text);
		JSCUMMtexts.texts.push(text);
	}else {
		log.debug("(JSCUMMtexts.add_text) Text not added: " + text);
	}
};

JSCUMMtexts.add_ntxt = function(command){
	log.debug("(JSCUMMtexts.add_ntxt) Adding texts of the command: " + JSON.stringify(command));
	for (var index = 0 ; index < command.txt.length ; index++){
		JSCUMMtexts.add_text(command.txt[index]);
	}
};

JSCUMMtexts.add_if = function(command){
	log.debug("(JSCUMMtexts.add_if) Adding texts of the command: " + JSON.stringify(command));
	
	JSCUMMtexts.interpret_commands_list(command["then"]);
	JSCUMMtexts.interpret_commands_list(command["else"]);
};

JSCUMMtexts.add_rand = function(command){
	log.debug("(JSCUMMtexts.add_rand) Adding texts of the command: " + JSON.stringify(command));
	for (var index = 0 ; index < command.coms.length ; index++){
		JSCUMMtexts.interpret_commands_list(command.coms[index]);
	}
};


JSCUMMtexts.add_splash_image = function(command){
	log.info("(JSCUMMtexts.add_splash_image) Adding texts of the command: " + JSON.stringify(command));
	JSCUMMtexts.add_text(command["image"]);
};

JSCUMMtexts.add_image = function(command){
	log.info("(textosJSCUMM.anyade_imagen) Adding texts of the command: " + JSON.stringify(command));
	JSCUMMtexts.add_text(command["image"]);
};

JSCUMMtexts.add_options = function(command){
	log.debug("(textosJSCUMM.anyade_ops) Adding texts of the command: " + JSON.stringify(command));
	
	for (var index = 0 ; index < command.ops.length ; index++){
		JSCUMMtexts.add_text(command.ops[index].txt);
		JSCUMMtexts.interpret_commands_list(command.ops[index].coms);
	}
};

// Adding the translations of the actions in the actions_gui
JSCUMMtexts.add_gui_actions = function(action_gui){
		log.debug("(JSCUMMtexts.add_gui_actions) Adding action: " + JSON.stringify(action_gui));

		JSCUMMtexts.add_text(action_gui.text);
		if (action_gui.dative == true){
			log.debug("(JSCUMMtexts.add_gui_actions) Adding th epreposition: " + action_gui.preposition);
			JSCUMMtexts.add_text(action_gui.preposition);
		}
};

JSCUMMtexts.interpret_actions_gui = function(){
		log.debug("(JSCUMMtexts.interpret_actions_gui) Interpreting the GUI actions.");

		for (var index = 0 ; index < JSCUMMtexts.actions_gui.length ; index++){
			JSCUMMtexts.add_gui_actions(JSCUMMtexts.actions_gui[index]);
		}
};

JSCUMMtexts.interpret_command = function(command){
	log.debug("(textosJSCUMM.interpret_command) Interpreting command: " + JSON.stringify(command));
	switch (command.com) {
			case "ntxt":
				JSCUMMtexts.add_ntxt(command);
				break;
			case "if":
				JSCUMMtexts.add_if(command);
				break;
			case "ops":
				JSCUMMtexts.add_options(command);
				break;
			case "rand":
				JSCUMMtexts.add_rand(command);
				break;
			case "+splash":
				JSCUMMtexts.add_splash_image(command);
				break;
			case "+img":
				JSCUMMtexts.add_image(command);
				break;
			default:
				log.trace("(JSCUMM.interpret_command) Cannot add texts for this command: " + JSON.stringify(command));
		}
};

JSCUMMtexts.interpret_commands_list = function(command_list){
	log.debug("(JSCUMMtexts.interpret_commands_list) Interpreting command list");
	for (var index = 0 ; index < command_list.length ; index++){
		JSCUMMtexts.interpret_command(command_list[index]);
	}
};

JSCUMMtexts.interpret_action = function(id,action){
	log.debug("(JSCUMMtexts.interpret_action) Interpret action: " + id);

	if (Array.isArray(action) == true){
		log.debug("(textosJSCUMM.interpreta_personaje) Adding commands" + action);
		JSCUMMtexts.interpret_commands_list(action);
	} else{
		JSCUMMtexts.interpret_actions_list(action);
	}
};

JSCUMMtexts.interpret_actions_list = function(actions_list){
	log.debug("(textosJSCUMM.interpret_actions_list) Interpreting actions list." );
	
	var actions = Object.keys(actions_list);
	for (var index = 0 ; index < actions.length ; index++){
		JSCUMMtexts.interpret_action(actions[index], actions_list[actions[index]]);
	}
};

JSCUMMtexts.interpret_character = function(character){
	log.debug("(JSCUMMtexts.interpret_character) Interpreting character: " + character.id);
	
	JSCUMMtexts.add_text(character.name);
	JSCUMMtexts.interpret_actions_list(character.actions);
};

JSCUMMtexts.interpret_scene = function(scene){
	log.debug("(JSCUMMtexts.interpret_scene) Interpreting scene: " + scene.id);
	
	JSCUMMtexts.add_text(scene.name);
	JSCUMMtexts.interpret_commands_list(scene["initial_commands"]);
	JSCUMMtexts.interpret_commands_list(scene["ending_commands"]);
	JSCUMMtexts.interpret_commands_list(scene["default_commands"]);
	
	for (var index = 0 ; index < scene.characters.length ; index++){
		JSCUMMtexts.interpret_character(scene.characters[index]);
	}
};

JSCUMMtexts.interpret_item = function(item){
		log.debug("(JSCUMMtexts.interpret_item) Interpreting item: " + item.id);
		
		JSCUMMtexts.add_text(item.name);
		JSCUMMtexts.interpret_actions_list(item.actions);
};

JSCUMMtexts.interpret_items = function(){
	log.debug("(JSCUMMtexts.interpret_items) Interpreting items ");
	
	for (var index = 0 ; index < JSCUMMtexts.items_loaded.length ; index++){
		JSCUMMtexts.interpret_item(JSCUMMtexts.items_loaded[index]);
	}
};

JSCUMMtexts.interpret_scenes = function(){
	log.info("(JSCUMMtexts.interpret_scenes) Interpreting list of scenes");
	for (var index = 0 ; index < JSCUMMtexts.scenes_loaded.length ; index++){
		JSCUMMtexts.interpret_scene(JSCUMMtexts.scenes_loaded[index]);
	}
};

JSCUMMtexts.load_scene = function(scene){
	log.info("(textosJSCUMM.load_scene) Loading scene: " + scene);
	
	var scene_route = SCENES_DIRECTORY + "/" + scene + ".json";
	try {
		$.getJSON(scene_route, function (json) {
			JSCUMMtexts.scenes_loaded.push(json);
		})
		.error(function(XMLHttpRequest, textStatus, errorThrown){
			log.error("(textosJSCUMM.load_scene) Error loading the scene.");
			log.error("(textosJSCUMM.load_scene) TextStatus" + textStatus);
			log.error("(textosJSCUMM.load_scene) ErrorThrown" + errorThrown);
		});
	} catch (error) {
		log.error("(textosJSCUMM.load_scene) Error loading the scene.");
		log.error(error);
	} 
};

JSCUMMtexts.load_items = function(){
	log.info("(JSCUMMtexts.load_items) Loading items.");
	
	var items_route = ITEMS_DIRECTORY + "/items.json";
	try {
		$.getJSON(items_route, function (json) {
			JSCUMMtexts.items_loaded = eval(json);
		})
		.error(function(XMLHttpRequest, textStatus, errorThrown){
			log.error("(textosJSCUMM.load_items) Error loading the items.");
			log.error("(textosJSCUMM.load_items) TextStatus" + textStatus);
			log.error("(textosJSCUMM.load_items) ErrorThrown" + errorThrown);
		});
	} catch (error) {
		log.error("(textosJSCUMM.load_items) Error loading the items.");
		log.error(error);
	} 
};

JSCUMMtexts.load_scenes_list = function(){
	log.debug("(JSCUMMtexts.load_scenes_list) Load a list of scenes: " + scenes);
	for (var index = 0 ; index < scenes.length ; index++){
		JSCUMMtexts.load_scene(scenes[index]);
	}
};

JSCUMMtexts.get_untranslated_texts = function(complete_texts){
	log.debug("(JSCUMMtexts.get_untranslated_texts) Removing translated texts.");
	var texts_untranstaled = [];
	for (var index = 0 ; index < complete_texts.length ; index++){
		if (JSCUMMtexts.current_lang[complete_texts[index]] == undefined){
			log.debug("(JSCUMMtexts.get_untranslated_texts) Text for: " + complete_texts[index] + " -> " + JSCUMMtexts.current_lang[complete_texts[index]]);
			texts_untranstaled.push(complete_texts[index]);
		}
	}
	return(texts_untranstaled);
};

JSCUMMtexts.show_texts = function(texts_to_show){
	log.info("(JSCUMMtexts.show_texts) Showing texts. Number: " + texts_to_show.length);
	log.info("(textosJSCUMM.muestra_textos) Texts already translated. Number: " + Object.keys(JSCUMMtexts.current_lang).length);
	$("#texts").html(texts_to_show.sort().join("<br>"));
};

$(window).load(function () {
	JSCUMMtexts.load_actions();
	JSCUMMtexts.load_scenes_list();
	JSCUMMtexts.load_items();
	JSCUMMtexts.load_languages();
	$("#get_all_texts_button").click(function(){
		JSCUMMtexts.get_texts(true);
	});
	$("#get_untranslated_texts_button").click(function(){
		JSCUMMtexts.get_texts(false);
	});
});

JSCUMMtexts.get_texts = function(show_all){
	$(".buttons").html("");
	JSCUMMtexts.current_lang = JSCUMMtexts.lang_es;
	JSCUMMtexts.add_contant_texts();
	JSCUMMtexts.interpret_actions_gui();
	JSCUMMtexts.interpret_scenes();
	JSCUMMtexts.interpret_items();
	var texts_to_show = [];
	if (show_all){
		texts_to_show = JSCUMMtexts.texts;
	} else{
		texts_to_show = JSCUMMtexts.get_untranslated_texts(JSCUMMtexts.texts);
	}
	JSCUMMtexts.show_texts(texts_to_show);
};