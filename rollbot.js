var request = require('request');

module.exports = function (req, res, next) {
  // default roll is 1d20
  var matches;
  var defaultmod;
  var weapons;
  var times = 1;
  var die = 20;
  var modifier = "+";
  var modifier_value = 0;
  var rolls = [];
  var total = 0;
  var botPayload = {};
  var critArray = [" CRIT!"," AWH YEAH BIG CRITS!"," CRITTY DITTY DO!"," MMM SEXY CRIT TIMES!"," CRITATTACK!"," M-M-M-MONSTER KILL!", " SUCH CRIT. MUCH DAMAGE.", " GOING... GOING... GONE!", " YAY BIG NUMBERS!", " NICE CRIT, DOES IT COME IN HETERO?", " YOU DONE GOOD, KID", " CRITALCULAR!", " DOINK!"]
  var missArray = [" YOU SUCK B!"," YOU JUST HIT YOURSELF!"," SLICE! THERE GOES YA PENIS!"," CRITICAL MISS, NUBCAKES!"," WIGGIDTY WAM WAM WOZZLE YA MISSED!"," BABBY'S FIRST SWORD SWING!" ," IS YOUR NAME STEVE FISHER? MAN YOU SUCK.", " LOLOLOLOLOLOL REZ INCOMING NUB", " THAT'S RARELY GOOD", " YA DONE GOOFED", " BIFFED IT", " BIFFED IT HARD", " WELL AT LEAST YOUR PARENTS STILL LOVE YOU", " THIS IS WHY WE CAN'T HAVE NICE THINGS", " I CAN'T BELIEVE YOU'VE DONE THIS", " GOOD JOB, [BLIND CELEBRITY NAME HERE]"]
  var nameArray = ["ZIMZAMTHEROLLYMAN","ROLLBOT","TRANSFORMANDROLLOUTBOT","BOLLROT","ROLLYPOLLYOLLYROLLBOT","ROLLSMAN5000","CRITOMATIC","MISSOMATIC","WAMBAMROLLERMAN", "ROLLYAL WITH CHEESEBOT", "PATCHES O'ROLLIHAN","ROLLBITCH","SNAPCRACKLEMITCHANDROLLBOT","ROLLSLAVE","BIGDADDYROLLS","ROLLROLLROLLYOURBOATBOT","ROLLANDO BLOOM","ROLLTIDE","HITOMATIC","HANDYDANDYROLLBOT","YOUR FRIENDLY NEIGHBORHOOD ROLLBOT","ROLLANDY MARSH", "'THE' ROLLHIO STATE UNIVERSITY","ROLLUMBUSBOT","ROLLGAZO THE MIGHTY ROLL GOD","DROLLPH LUNDGREN","OOO, BAROLLCUDA","ADROLLPH HITLER","RNGESUS","RANDY QUAID","ROLLO TONY BROWN TOWN","ROLLNADOBOT","ROLLNADOBOT II: STILL ROLLING","ROLLNADOBOT III: SUMMER OF ROLLNADOBOT","ROLLNADOBOT IV: ROLL OUT","ROLLNADOBOT V: EASY COME EASY ROLL","ROLLNADOBOT VI: THE FINAL ROLLDOWN","ROLLNADOBOT VII: ONE MORE FOR THE ROLL","ROLLNADOBOT VIII: THE ROLLUNION","ROLLNADOBOT IX: THE PERFECT ROLL","ROLLSY O'DONNELL","TROLLROLLOLBOT","ROLLTANA","CAROLLS SANTANA","CPT SISKROLLS","USS ENTROLLPRISEBOT","DEEP ROLLS 9","RANDOM NUMBER GENERATOR BOT","BEEPBOOPHERESYOURROLL","KING GADROLLA","MECHAGODZIROLLABOT","GODZILLROLLABOT","D-BOT", "THE GREAT ROLLBANZO","VINCENT VAN ROLLBOT","CRAPPYROLLBOT"];
  var randomCrit = critArray[Math.floor(Math.random()*critArray.length)];
  var randomMiss = missArray[Math.floor(Math.random()*missArray.length)];
  var randomName = nameArray[Math.floor(Math.random()*nameArray.length)];



  if (req.body.text) {
    // parse roll type if specified
	defaultmod = req.body.text.match(/^$|\s*(\+|\-)(\d{1,3})$/);
    matches = req.body.text.match(/^(\d{1,3})d(\d{1,3})($|\s*(\+|\-)(\d{1,3})$)/);
	weapons = req.body.text.match(/((\d{1,3})\s*)?(club|dagger|greatclub|handaxe|javelin|lighthammer|mace|quarterstaff|sickle|spear|lightcrossbow|dart|shortbow|sling|battleaxe|flail|glaive|greataxe|greatsword|halberd|lance|longsword|maul|morningstar|pike|rapier|scimitar|shortsword|trident|warpick|warhammer|whip|handcrossbow|heavycrossbow|longbow)($|\s*(\+|\-)(\d{1,3})$)/);
    //matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})$/);
    console.log(matches);
    if (matches && matches[1] && matches[2]) {
      times = matches[1];
      die = matches[2];
      if (matches[3]){
        modifier = matches[4];
        modifier_value = Number(matches[5]);
        console.log(matches[4]);
        console.log(matches[5]);
      }

    } 
	else if(defaultmod && !weapons) {
		times = 1;
		die = 20;
		modifier = defaultmod[1];
		modifier_value = Number(defaultmod[2]);
	}
	else if(weapons) {
		times = 1;
		console.log(weapons);
		if(weapons[1] && weapons[2]) {
			times = weapons[2];
		}
		else {
			times = 1;
		}
		if(/club|dagger|lighthammer|sickle|dart|sling|whip/.test(weapons[3])) {
			die = 4;
		}
		if(/handaxe|javelin|mace|quarterstaff|spear|shortbow|scimitar|shortsword|trident|handcrossbow|greatsword|maul/.test(weapons[3])) {
			if(weapons[3] == "greatsword" || weapons[3] == "maul") {
				times = times*2;
			}
			die = 6;
		}
		if(/greatclub|lightcrossbow|battleaxe|flail|longsword|morningstar|rapier|warpick|warhammer|longbow/.test(weapons[3])) {
			die = 8;
		}
		if(/glaive|halberd|pike|heavycrossbow/.test(weapons[3])) {
			die = 10;
		}
		if(/greataxe|lance/.test(weapons[3])) {
			die = 12;
		}
		if(weapons[4]) {
			modifier = weapons[5];
			modifier_value = Number(weapons[6]);
		}
	}
	else {
      // send error message back to user if input is bad
      return res.status(200).send('<number>d<sides>');
    }
  }

  // roll dice and sum
  for (var i = 0; i < times; i++) {
    var currentRoll = roll(1, die);
	var rollTotal = times*die;
	var badRoll = times*1;
    rolls.push(currentRoll);
    total += currentRoll;
  }

  // write response message and add to payload
  if (modifier_value){
	var unmodifiedTotal = total;
	
	if(unmodifiedTotal === rollTotal && die === 20) {
		var didCrit = randomCrit;
	}
	else if(unmodifiedTotal === badRoll && die === 20) {
		var didCrit = randomMiss;
	}
	else {
		var didCrit = ""
	}
	
    if (modifier == '+'){
      total = total + modifier_value;
      console.log(total)
    }

    else if(modifier == '-'){
      total = total - modifier_value;
      console.log(total)
    }

    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' (' + modifier + modifier_value + ') = *' + total + '*' + didCrit;
  } 
  else {
	if(total === rollTotal && die === 20) {
		var didCrit = randomCrit;
	}
	else if(total === badRoll && die === 20) {
		var didCrit = randomMiss;
	}
	else {
		var didCrit = ""
	}
    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' = *' + total + '*' + didCrit;
  }
  botPayload.username = randomName;
  botPayload.channel = req.body.channel_id;
  botPayload.icon_emoji = ':game_die:';

  // send dice roll
  send(botPayload, function (error, status, body) {
    if (error) {
      return next(error);

    } else if (status !== 200) {
      // inform user that our Incoming WebHook failed
      return next(new Error('Incoming WebHook: ' + status + ' ' + body));

    } else {
      return res.status(200).end();
    }
  });
}


function roll (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function send (payload, callback) {
  var path = process.env.INCOMING_WEBHOOK_PATH;
  var uri = 'https://hooks.slack.com/services' + path;
 
  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}