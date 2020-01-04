var log = new Object();

// Defines the log level by default
log.level = "TRACE";

log.levels = {
	"NONE": 0,
	"ERROR": 10,
	"WARNING": 20,
	"INFO": 30,
	"DEBUG": 40,
	"TRACE": 50
};

log.log = function (message_level, text, color) {
    var current_time = new Date();
	var day_time = current_time.getDate() 
					+ "/" + (current_time.getMonth() + 1) 
					+ "/" + current_time.getFullYear() 
					+ " " + current_time.getHours() 
					+ ":" + current_time.getMinutes() 
					+ ":" + current_time.getSeconds();
	
	if (log.levels[log.level] >= log.levels[message_level]){
		console.log("%c[" + message_level + "]" +
			day_time +
			" : " +
			text,
			"color:" + color);
	}
};

log.error = function(text){
    log.log("ERROR",text,"red");
};

log.warning = function(text){
    log.log("WARNING",text,"darkmagenta");
};

log.info = function(text){
    log.log("INFO",text,"darkgreen");
};

log.debug = function(text){
    log.log("DEBUG",text,"darkblue");
};

log.trace = function(text){
    log.log("TRACE",text,"grey");
};
