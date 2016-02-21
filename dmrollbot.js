var request = require('request');

module.exports = function (req, res, next) {
  // default roll is 1d20
  var matches;
  var times = 1;
  var die = 20;
  var modifier = "+";
  var modifier_value = 0;
  var resultText = "";
  var rolls = [];
  var total = 0;
  var botPayload = {};
  var critArray = [" CRIT!"," AWH YEAH BIG CRITS!"," CRITTY DITTY DO!"," MMM SEXY CRIT TIMES!"," CRITATTACK!"," M-M-M-MONSTER KILL!"]
  var missArray = [" YOU SUCK B!"," YOU JUST HIT YOURSELF!"," SLICE! THERE GOES YA PENIS!"," CRITICAL MISS, NUBCAKES!"," WIGGIDTY WAM WAM WOZZLE YA MISSED!"," BABBY'S FIRST SWORD SWING!" ," IS YOUR NAME STEVE FISHER? MAN YOU SUCK."]
  var randomCrit = critArray[Math.floor(Math.random()*critArray.length)];
  var randomMiss = missArray[Math.floor(Math.random()*missArray.length)];
  var privateSend = "@"+req.body.user_name;


  if (req.body.text) {
    // parse roll type if specified
	defaultmod = req.body.text.match(/^$|\s*(\+|\-)(\d{1,3})$/);
    matches = req.body.text.match(/^(\d{1,3})d(\d{1,3})($|\s*(\+|\-)(\d{1,3})$)/);
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
	else if(defaultmod) {
		times = 1;
		die = 20;
		modifier = defaultmod[1];
		modifier_value = Number(defaultmod[2]);
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
	
	if(unmodifiedTotal === rollTotal) {
		var didCrit = randomCrit;
	}
	else if(unmodifiedTotal === badRoll) {
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

    resultText = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' (' + modifier + modifier_value + ') = *' + total + '*' + didCrit;
  } 
  else {
	if(total === rollTotal) {
		var didCrit = randomCrit;
	}
	else if(total === badRoll) {
		var didCrit = randomMiss;
	}
	else {
		var didCrit = ""
	}
    resultText = req.body.user_name + ' rolled ' + times + 'd' + die + ':\n' +
                      rolls.join(' + ') + ' = *' + total + '*' + didCrit;
  }
  botPayload = "{
	"username": "DMBOT",
    "response_type": "ephemeral",
    "text": "resultText",
	"channel": "req.body.channel_id",
	"icon_emoji":":game_die:"
	}"

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