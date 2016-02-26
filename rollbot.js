var request = require('request');

module.exports = function (req, res, next) {
  // default roll is 1d20
  var matches;
  var weapons;
  var rollNote = "";
  var times = 1;
  var die = 20;
  var modifier = "+";
  var modifier_value = 0;
  var rolls = [];
  var total = 0;
  var botPayload = {};
  var missEmojiArray = [":hatched_chick:",":poop:",":baby_chick:",":laughing:",":frowning:",":thumbsdown:"];
  var hitEmojiArray = [":bangbang:",":clap:",":rage:",":hammer:",":bomb:",":skull:"];
  var critArray = [" CRIT!"," AWH YEAH BIG CRITS!"," CRITTY DITTY DO!"," MMM SEXY CRIT TIMES!"," CRITATTACK!"," M-M-M-MONSTER KILL!", " SUCH CRIT. MUCH DAMAGE.", " GOING... GOING... GONE!", " YAY BIG NUMBERS!", " NICE CRIT, SEXY.", " YOU DONE GOOD, KID", " CRITALCULAR!", " DOINK!"," NICE ONE, BRUVA!"]
  var missArray = [" YOU SUCK B!"," YOU JUST HIT YOURSELF!"," SLICE! THERE GOES YA PENIS!"," CRITICAL MISS, NUBCAKES!"," WIGGIDTY WAM WAM WOZZLE YA MISSED!"," BABBY'S FIRST SWORD SWING!" ," IS YOUR NAME STEVE FISHER? MAN YOU SUCK.", " LOLOLOLOLOLOL REZ INCOMING NUB", " THAT'S RARELY GOOD", " YA DONE GOOFED", " BIFFED IT", " BIFFED IT HARD", " WELL AT LEAST YOUR PARENTS STILL LOVE YOU", " THIS IS WHY WE CAN'T HAVE NICE THINGS", " I CAN'T BELIEVE YOU'VE DONE THIS", " GOOD JOB, [BLIND CELEBRITY NAME HERE]"]
  var nameArray = ["ZIMZAMTHEROLLYMAN","ROLLBOT","TRANSFORMANDROLLOUTBOT","BOLLROT","ROLLYPOLLYOLLYROLLBOT","ROLLSMAN5000","CRITOMATIC","MISSOMATIC","WAMBAMROLLERMAN", "ROLLYAL WITH CHEESEBOT", "PATCHES O'ROLLIHAN","ROLLBITCH","SNAPCRACKLEMITCHANDROLLBOT","ROLLSLAVE","BIGDADDYROLLS","ROLLROLLROLLYOURBOATBOT","ROLLANDO BLOOM","ROLLTIDE","HITOMATIC","HANDYDANDYROLLBOT","YOUR FRIENDLY NEIGHBORHOOD ROLLBOT","ROLLANDY MARSH", "'THE' ROLLHIO STATE UNIVERSITY","ROLLUMBUSBOT","ROLLGAZO THE MIGHTY ROLL GOD","DROLLPH LUNDGREN","OOO, BAROLLCUDA","ADROLLPH HITLER","RNGESUS","RANDY QUAID","ROLLO TONY BROWN TOWN","ROLLNADOBOT","ROLLNADOBOT II: STILL ROLLING","ROLLNADOBOT III: SUMMER OF ROLLNADOBOT","ROLLNADOBOT IV: ROLL OUT","ROLLNADOBOT V: EASY COME EASY ROLL","ROLLNADOBOT VI: THE FINAL ROLLDOWN","ROLLNADOBOT VII: ONE MORE FOR THE ROLL","ROLLNADOBOT VIII: THE ROLLUNION","ROLLNADOBOT IX: THE PERFECT ROLL","ROLLSY O'DONNELL","TROLLROLLOLBOT","ROLLTANA","CAROLLS SANTANA","CPT SISKROLLS","USS ENTROLLPRISEBOT","DEEP ROLLS 9","RANDOM NUMBER GENERATOR BOT","BEEPBOOPHERESYOURROLL","KING GADROLLA","MECHAGODZIROLLABOT","GODZILLROLLABOT","D-BOT", "THE GREAT ROLLBANZO","VINCENT VAN ROLLBOT","CRAPPYROLLBOT", "BARCEROLLA FC BOT","ROLLERDISCOBOT","ROLLSEPH STALIN","TEDDY ROLLSEVELT","FRANKLIN D. ROLLSEVELT","WINSTROLL CHURCHILL","BENITROLL MUSSOLINI","HIDEKI TOROLL","ROLLEAL MADRIDBOT"]
  var randomCrit = critArray[Math.floor(Math.random()*critArray.length)];
  var randomMiss = missArray[Math.floor(Math.random()*missArray.length)];
  var randomName = nameArray[Math.floor(Math.random()*nameArray.length)];
  var randomMissEmoji = missEmojiArray[Math.floor(Math.random()*missEmojiArray.length)];
  var randomHitEmoji = hitEmojiArray[Math.floor(Math.random()*hitEmojiArray.length)];


  var didCrit = false;
  var didMiss = false;



  if (req.body.text) {
    // parse roll type if specified
	matches = req.body.text.match(/((\d{1,3})d(\d{1,3}))?((\d{1,3})(\s)?)?(club|dagger|greatclub|handaxe|javelin|lighthammer|mace|quarterstaff|sickle|spear|lightcrossbow|dart|shortbow|sling|battleaxe|flail|glaive|greataxe|greatsword|halberd|lance|longsword|maul|morningstar|pike|rapier|scimitar|shortsword|trident|warpick|warhammer|whip|handcrossbow|heavycrossbow|longbow)?((\s?)(\+|\-)(\d{1,3}))?((\s)?\-(.*$))?/);
    //matches = req.body.text.match(/^(\d{1,2})d(\d{1,2})$/);
    console.log(matches);
console.log(matches[0]);
	if (matches) {
		times = 1;
		if(matches[2]) {
			times = matches[2];
		}
		if(matches[3]) {
			die = matches[3];
		}
		if(matches[4] && matches[5]) {
			times = matches[5];
		}
		if(matches[7]) {
			if(/club|dagger|lighthammer|sickle|dart|sling|whip/.test(matches[7])) {
				die = 4;
			}
			if(/handaxe|javelin|mace|quarterstaff|spear|shortbow|scimitar|shortsword|trident|handcrossbow|greatsword|maul/.test(matches[7])) {
				if(matches[7] == "greatsword" || matches[7] == "maul") {
					times = times*2;
				}
				die = 6;
			}
			if(/greatclub|lightcrossbow|battleaxe|flail|longsword|morningstar|rapier|warpick|warhammer|longbow/.test(matches[6])) {
				die = 8;
			}
			if(/glaive|halberd|pike|heavycrossbow/.test(matches[7])) {
				die = 10;
			}
			if(/greataxe|lance/.test(matches[7])) {
				die = 12;
			}
		}
      	if (matches[8]){
        	modifier = matches[10];
        	modifier_value = Number(matches[11]);
      	}
		if (matches[12]){
			if(matches[14] === "help") {
				      return res.status(200).send('DICE METHOD: <number>d<sides> AND/OR <+/-modifer> AND/OR <-message> \n WEAPON METHOD: <numberofweaponsifmorethanone> <weaponname> AND/OR <+/-modifer> AND/OR <-message> \n Use message -dm for private roll');
			}
			else {
			rollNote = "(*"+matches[14]+"*)";
			}
		}
    }
	else {
      // send error message back to user if input is bad
				      return res.status(200).send('DICE METHOD: <number>d<sides> AND/OR <+/-modifer> AND/OR <-message> \n WEAPON METHOD: <numberofweaponsifmorethanone> <weaponname> AND/OR <+/-modifer> AND/OR <-message> \n Use message -dm for private roll');
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
	
	if(unmodifiedTotal === rollTotal) {
		var message = randomCrit;
		didCrit = true;
	}
	else if(unmodifiedTotal === badRoll) {
		var message = randomMiss;
		didMiss = true;
	}
	else {
		var message = ""
	}
	
    if (modifier == '+'){
      total = total + modifier_value;
      console.log(total)
    }

    else if(modifier == '-'){
      total = total - modifier_value;
      console.log(total)
    }

    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + rollNote + ':\n' +
                      rolls.join(' + ') + ' (' + modifier + modifier_value + ') = *' + total + '*' + message;
  } 
  else {
	if(total === rollTotal) {
		var message = randomCrit;
		didCrit = true;
	}
	else if(total === badRoll) {
		var message = randomMiss;
		didMiss = true;
	}
	else {
		var message = ""
	}
    botPayload.text = req.body.user_name + ' rolled ' + times + 'd' + die + rollNote + ':\n' +
                      rolls.join(' + ') + ' = *' + total + '*' + message;
  }
  botPayload.username = randomName;
  botPayload.channel = req.body.channel_id;
  if(didCrit) {
  	botPayload.icon_emoji = randomHitEmoji;
  }
  else if(didMiss) {
  	botPayload.icon_emoji = randomMissEmoji;
  }
  else {
  	  botPayload.icon_emoji = ':game_die:';
  }
    
  if(matches[14] === "dm") {
  	  return res.status(200).send(rolls.join(' + ') + ' = *' + total + '*' + message);
  }	
  
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