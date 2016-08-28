var http = require('http');
var Discord = require("discord.js");
var express = require("express");

var app = express();
var port = process.env.PORT || 3000;

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function() {
    console.log('rollbot listening on port ' + port);
});

// Get the email and password
var AuthDetails = require("./auth_dev.json");

var bot = new Discord.Client();

var idleTimer;
var genChannel;
var awakeArray = []; 
var randomAwakeMessage;


//when the bot is ready
bot.on("ready", () => {
    console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
    genChannel = bot.channels.get("name","rollbot_house").id;
    //1440000
    idleTimer = setInterval(keepAwake, 900000);
    bot.setStatus("online","/roll help for syntax");
    bot.channels.get("id",genChannel).sendMessage("I'm back, baby :joy:");
});

//when the bot disconnects
bot.on("disconnected", () => {
    //alert the console
    console.log("Disconnected!");

    //exit node.js with an error
    process.exit(1);
});

//when the bot receives a message
bot.on("message", msg => {

    var matches = "";
    var weapons;
    var rollNote = "";
    var times = 1;
    var die = 20;
    var modifier = "+";
    var modifier_value = 0;
    var rolls = [];
    var total = 0;
    var botPayload = {};
    var missEmojiArray = [":hatched_chick:", ":poop:", ":baby_chick:", ":laughing:", ":frowning:", ":thumbsdown:"];
    var hitEmojiArray = [":bangbang:", ":clap:", ":rage:", ":hammer:", ":bomb:", ":skull:"];
    var critArray = [" CRIT!", " AWH YEAH BIG CRITS!", " CRITTY DITTY DO!", " MMM SEXY CRIT TIMES!", " CRITATTACK!", " M-M-M-MONSTER KILL!", " SUCH CRIT. MUCH DAMAGE.", " GOING... GOING... GONE!", " YAY BIG NUMBERS!", " NICE CRIT, SEXY.", " YOU DONE GOOD, KID", " CRITALCULAR!", " DOINK!", " NICE ONE, BRUVA!"]
    var missArray = [" YOU SUCK B!", " YOU JUST HIT YOURSELF!", " SLICE! THERE GOES YA PENIS!", " CRITICAL MISS, NUBCAKES!", " WIGGIDTY WAM WAM WOZZLE YA MISSED!", " BABBY'S FIRST SWORD SWING!"," LOLOLOLOLOLOL REZ INCOMING NUB", " THAT'S RARELY GOOD", " YA DONE GOOFED", " BIFFED IT", " BIFFED IT HARD", " WELL AT LEAST YOUR PARENTS STILL LOVE YOU", " THIS IS WHY WE CAN'T HAVE NICE THINGS", " I CAN'T BELIEVE YOU'VE DONE THIS", " GOOD JOB, [BLIND CELEBRITY NAME HERE]", " RUN, JUST BAIL. FORGET YOUR PARTY MEMBERS." , " DON'T WORRY I'M SURE YOUR PARTY DOESN'T MIND CARRYING YOU", " YOU'LL MAKE A PRETTY CORPSE", " WOULD YOU LIKE YOUR REMAINS VACUUM DESICCATED?" , " FLOOR'S COLD, ISN'T IT?"];
    var nameArray = ["ZIMZAMTHEROLLYMAN", "ROLLBOT", "TRANSFORMANDROLLOUTBOT", "BOLLROT", "ROLLYPOLLYOLLYROLLBOT", "ROLLSMAN5000", "CRITOMATIC", "MISSOMATIC", "WAMBAMROLLERMAN", "ROLLYAL WITH CHEESEBOT", "PATCHES O'ROLLIHAN", "ROLLBITCH", "SNAPCRACKLEMITCHANDROLLBOT", "ROLLSLAVE", "BIGDADDYROLLS", "ROLLROLLROLLYOURBOATBOT", "ROLLANDO BLOOM", "ROLLTIDE", "HITOMATIC", "HANDYDANDYROLLBOT", "YOUR FRIENDLY NEIGHBORHOOD ROLLBOT", "ROLLANDY MARSH", "'THE' ROLLHIO STATE UNIVERSITY", "ROLLUMBUSBOT", "ROLLGAZO THE MIGHTY ROLL GOD", "DROLLPH LUNDGREN", "OOO, BAROLLCUDA", "ADROLLPH HITLER", "RNGESUS", "RANDY QUAID", "ROLLO TONY BROWN TOWN", "ROLLNADOBOT", "ROLLNADOBOT II: STILL ROLLING", "ROLLNADOBOT III: SUMMER OF ROLLNADOBOT", "ROLLNADOBOT IV: ROLL OUT", "ROLLNADOBOT V: EASY COME EASY ROLL", "ROLLNADOBOT VI: THE FINAL ROLLDOWN", "ROLLNADOBOT VII: ONE MORE FOR THE ROLL", "ROLLNADOBOT VIII: THE ROLLUNION", "ROLLNADOBOT IX: THE PERFECT ROLL", "ROLLSY O'DONNELL", "TROLLROLLOLBOT", "ROLLTANA", "CAROLLS SANTANA", "CPT SISKROLLS", "USS ENTROLLPRISEBOT", "DEEP ROLLS 9", "RANDOM NUMBER GENERATOR BOT", "BEEPBOOPHERESYOURROLL", "KING GADROLLA", "MECHAGODZIROLLABOT", "GODZILLROLLABOT", "D-BOT", "THE GREAT ROLLBANZO", "VINCENT VAN ROLLBOT", "CRAPPYROLLBOT", "BARCEROLLA FC BOT", "ROLLERDISCOBOT", "ROLLSEPH STALIN", "TEDDY ROLLSEVELT", "FRANKLIN D. ROLLSEVELT", "WINSTROLL CHURCHILL", "BENITROLL MUSSOLINI", "HIDEKI TOROLL", "ROLLEAL MADRIDBOT", "RPBOTSUCKSBOT", "RPBOTISNTSOBADBOT", "RPBOTHASALOTOFGOODQUALITIESBOT", "RPBOTISADICKBOT", "RPBOT&ROLLBOT=BFF4EBOT"]
    var randomMissEmoji = missEmojiArray[Math.floor(Math.random() * missEmojiArray.length)];
    var randomHitEmoji = hitEmojiArray[Math.floor(Math.random() * hitEmojiArray.length)];
    var randomCrit = critArray[Math.floor(Math.random() * critArray.length)] + randomHitEmoji;
    var randomMiss = missArray[Math.floor(Math.random() * missArray.length)] + randomMissEmoji;
    var randomName = nameArray[Math.floor(Math.random() * nameArray.length)];


    var didCrit = false;
    var didMiss = false;

    var prefix = "/";

    if (!msg.content.startsWith(prefix)) return;


    if (msg.content.startsWith(prefix) && msg.content.match(/\/roll$/)) {
        matches = msg.content.match(/\/roll$/);
    } else if (msg.content.startsWith(prefix) && msg.content.match(/\/roll help/)) {
        if(msg.content.match(/\/roll help$/)) {
            var dmChannel = msg.author.id;
            bot.reply(msg, "DM Sent");

            bot.sendMessage(dmChannel, "**DICE METHOD:**\n*Syntax:* <number>d<sides> *AND/OR* <+/-modifer> *AND/OR* <-message>\n*Examples:\n1d4\n3d6 +3\n2d6 + 3 - message*\n1d10 -message\n\n**WEAPON METHOD:**\n*Syntax:* <numberofweaponsifmorethanone> <weaponname> *AND/OR* <+/-modifer> *AND/OR* <-message>\n*Examples:\nsling\nshortsword +1 2 longsword + 3 - message*\n2 greatsword -message\n\ntype '/roll help weapons' for weapons list");
        }
        else if(msg.content.match(/\/roll help weapons$/)) {
            var dmChannel = msg.author.id;
            bot.reply(msg, "DM Sent");
            bot.sendMessage(dmChannel, "club\ndagger\ngreatclub\nhandaxe\njavelin\nlighthammer\nmace\nquarterstaff\nsickle\nspear\nlightcrossbow\ndart\nshortbow\nsling\nbattleaxe\nflail\nglaive\ngreataxe\ngreatsword\nhalberd\nlance\nlongsword\nmaul\nmorningstar\npike\nrapier\nscimitar\nshortsword\ntrident\nwarpick\nwarhammer\nwhip\nhandcrossbow\nheavycrossbow\nlongbow");
        }
    }
    else if (msg.content.startsWith(prefix) && msg.content.match(/\/roll\s((\d{1,3})d(\d{1,3}))?((\d{1,3})(\s)?)?(club|dagger|greatclub|handaxe|javelin|lighthammer|mace|quarterstaff|sickle|spear|lightcrossbow|dart|shortbow|sling|battleaxe|flail|glaive|greataxe|greatsword|halberd|lance|longsword|maul|morningstar|pike|rapier|scimitar|shortsword|trident|warpick|warhammer|whip|handcrossbow|heavycrossbow|longbow)?((\s?)(\+|\-)\s?(\d{1,3}))?((\s)?\-\s?(.*$))?/)) {
        matches = msg.content.match(/\/roll\s((\d{1,3})d(\d{1,3}))?((\d{1,3})(\s)?)?(club|dagger|greatclub|handaxe|javelin|lighthammer|mace|quarterstaff|sickle|spear|lightcrossbow|dart|shortbow|sling|battleaxe|flail|glaive|greataxe|greatsword|halberd|lance|longsword|maul|morningstar|pike|rapier|scimitar|shortsword|trident|warpick|warhammer|whip|handcrossbow|heavycrossbow|longbow)?((\s?)(\+|\-)\s?(\d{1,3}))?((\s)?\-\s?(.*$))?/);
        console.log(matches);
        console.log(matches[0]);
        if (matches) {
            times = 1;
            if (matches[2]) {
                times = matches[2];
            }
            if (matches[3]) {
                die = matches[3];
            }
            if (matches[4] && matches[5]) {
                times = matches[5];
            }
            if (matches[7]) {
                if (/club|dagger|lighthammer|sickle|dart|sling|whip/.test(matches[7])) {
                    die = 4;
                }
                if (/handaxe|javelin|mace|quarterstaff|spear|shortbow|scimitar|shortsword|trident|handcrossbow|greatsword|maul/.test(matches[7])) {
                    if (matches[7] == "greatsword" || matches[7] == "maul") {
                        times = times * 2;
                    }
                    die = 6;
                }
                if (/greatclub|lightcrossbow|battleaxe|flail|longsword|morningstar|rapier|warpick|warhammer|longbow/.test(matches[7])) {
                    die = 8;
                }
                if (/glaive|halberd|pike|heavycrossbow/.test(matches[7])) {
                    die = 10;
                }
                if (/greataxe|lance/.test(matches[7])) {
                    die = 12;
                }
            }
            if (matches[8]) {
                modifier = matches[10];
                modifier_value = Number(matches[11]);
            }
            if (matches[12]) {
                rollNote = "(**" + matches[14] + "**)";
            }
        }

        //send a message to the channel the ping message was sent in.
        //bot.sendMessage(msg, "pong!");

        //alert the console
        //console.log("pong-ed " + msg.author.username);
    }

    if (matches) {
        // roll dice and sum
        for (var i = 0; i < times; i++) {
            var currentRoll = roll(1, die);
            var rollTotal = times * die;
            var badRoll = times * 1;
            rolls.push(currentRoll);
            total += currentRoll;
        }

        if (modifier_value) {
            var unmodifiedTotal = total;

            if (unmodifiedTotal === rollTotal) {
                var message = randomCrit;
                didCrit = true;
            } else if (unmodifiedTotal === badRoll) {
                var message = randomMiss;
                didMiss = true;
            } else {
                var message = ""
            }

            if (modifier == '+') {
                total = total + modifier_value;
                console.log(total)
            } else if (modifier == '-') {
                total = total - modifier_value;
                console.log(total)
            }
            //msg.channel.server.detailsOf(msg.author).nick
            botPayload.text = 'you rolled ' + times + 'd' + die + rollNote + ':\n' +
                rolls.join(' + ') + ' (' + modifier + modifier_value + ') = **' + total + ' ' + message + '**';
        } else {
            if (total === rollTotal) {
                var message = randomCrit;
                didCrit = true;
            } else if (total === badRoll) {
                var message = randomMiss;
                didMiss = true;
            } else {
                var message = ""
            }
            botPayload.text = 'you rolled ' + times + 'd' + die + rollNote + ':\n' +
                rolls.join(' + ') + ' = **' + total + ' ' + message + '**';
        }
        if (didCrit) {

        } else if (didMiss) {

        }
        else {
            bot.setStatus("online","/roll help for syntax");
        }
        botPayload.username = randomName;
        bot.setNickname(msg, botPayload.username);
        bot.reply(msg, botPayload.text);
        bot.deleteMessage(msg);
        clearInterval(idleTimer)
        //1440000
        idleTimer = setInterval(keepAwake, 900000);
    }
});

function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function keepAwake() {
    awakeArray = ["A rolling die gathers no moss","What? Huh? I'm awake","Oooo you touch my tra la la","SOMEBODY ROLL SOMETHING ALREADY","Rollout is the most underrated Ludacris song","ROLLBOT HUNGERS","Are you using RPBot?","Rolling (rolling) Rolling (rolling) Rolling down the river","Baby that's just how I roll"];
    randomAwakeMessage = awakeArray[Math.floor(Math.random() * awakeArray.length)];
    bot.channels.get("id",genChannel).sendMessage(randomAwakeMessage);
}

bot.loginWithToken(AuthDetails.token);