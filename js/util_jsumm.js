function search(objet,property,value){
	try{
		var found = $.grep(objet, function(e) {return e[property] == value});
		if (found.length > 0){
			log.trace("(search) Found this object: " + JSON.stringify(found));
			return(found[0]);
		} else{
      log.debug("(search) Not found the property (" + property 
              + ") with the value (" + value 
              + ") in the object: " + JSON.stringify(objet));
      log.trace("(search) Not found the value (" + value 
              + ") of the property (" + property 
              + ") in the object (" + JSON.stringify(objet) + ")");
			return(null);
		}
	}catch(error){
    log.error("(search) There was an errro searching the value (" + value 
              + ") of the property (" + property 
              + ") with teh value " + value 
              + " in the object (" + JSON.stringify(objet) + ")");
		log.error(error);
		return(null);
	}
}

function wordwrap(str, int_width, str_break, cut) {
  //  discuss at: http://phpjs.org/functions/wordwrap/
  // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // improved by: Nick Callen
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Sakimori
  //  revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
  // bugfixed by: Michael Grier
  // bugfixed by: Feras ALHAEK
  //   example 1: wordwrap('Kevin van Zonneveld', 6, '|', true);
  //   returns 1: 'Kevin |van |Zonnev|eld'
  //   example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n');
  //   returns 2: 'The quick brown fox <br />\njumped over the lazy<br />\n dog.'
  //   example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');
  //   returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod \ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim \nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea \ncommodo consequat.'

  var m = ((arguments.length >= 2) ? arguments[1] : 75);
  var b = ((arguments.length >= 3) ? arguments[2] : '\n');
  var c = ((arguments.length >= 4) ? arguments[3] : false);

  var i, j, l, s, r;

  str += '';

  if (m < 1) {
    return str;
  }

  for (i = -1, l = (r = str.split(/\r\n|\n|\r/))
    .length; ++i < l; r[i] += s) {
    for (s = r[i], r[i] = ''; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j))
        .length ? b : '')) {
      j = c == 2 || (j = s.slice(0, m + 1)
        .match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(
          m)
        .match(/^\S*/))[0].length;
    }
  }

  return r.join('\n');
}

http://stackoverflow.com/questions/951021/what-do-i-do-if-i-want-a-javascript-version-of-sleep
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}