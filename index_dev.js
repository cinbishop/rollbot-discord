var Discord = require("discord.js");

// Get the email and password
var AuthDetails = require("./auth_dev.json");

var bot = new Discord.Client();

var idleTimer;
var genChannel;
var awakeArray = []; 
var randomAwakeMessage;


//when the bot is ready
bot.on("ready", () => {
    console.log(`Ready to begin! Serving in ${bot.guilds.size} channels`);
    bot.user.setStatus('online','/roll help for help!');
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
    console.log(msg);
    var matches = "";
    var isDCCheck = false;
    var weapons;
    var rollNote = "";
    var times = 1;
    var die = 20;
    var modifier = "+";
    var greater_or_less = "";
    var modifierWrapper = "";
    var rollbotTaunt = "";
    var modifier_value = 0;
    var dc_value = 0;
    var dc_pass_fail_message = "";
    var rolls = [];

    var total = 0;
    var botPayload = {};
    var greetingArray = ["here's your rolls, hotstuff!", "I like it when you roll me like that!" , "I stole these from a wizard!" , "hope these numbers don't break your immersion!" , "many Bothans died to get these rolls." , "these aren't random, they're just my favorites." , "I roll so you don't have to." , "Biscuits? No, I'll take the rolls." , "here's the best rolls you can't eat!" , "rest assured, I did this on purpose." , "did you order some random numbers?" , "here you go!" , "did I do good?" , "did I do bad?" , "rolled by hand!" , "I hope these are as high as I am right now." , "I hope these are as long as your dong hangs." , "these are free-range organic numbers!" , "use these for good." , "use these for evil." , "use these to beat ass." , "use these to avoid getting your ass beat." , "a roll you requested and a roll you shall have!" , "you have 3 more free rolls remaining in your trial! Upgrade now!" , "you have 2 more free rolls remaining in your trial! Upgrade now!" , "you have 1 more free roll remaining in your trial! Upgrade now!" , "I'm the Gandalf of numbers, baby!" , "I'm the Dumbledore of numbers, baby!" , "I'm the Merlin of numbers, baby!" , "incoming transmission from the Big Giant Head!" , "wouldn't it be weird if I gave you those numbers from Lost?" , "a hobo gave me these." , "I fought a goose for these." , "A tiny man whispered these numbers to me in my robodreams!" , "sometimes I wish I was a djbot." , "here's your winning numbers!" , "here's your losing numbers, sucker!" , "Willy Wonka ain't got shit on me! Here's your rolls." , "I rolled these by mistake, here you go." , "beep boop outputting rolls!" , "rollbot in the house, bitches!" , "ain't nobody roll like me, baby." , "rollbot rolls because rolling is all rollbot knows." , "digital dice?! now I've seen everything!" , "rollbot is feeling merciful." , "rollbot is feeling vengeful." , "rollbot hungers for the great taste of Charleston Chew!" , "this roll brought to you by Slurm!" , "this roll brought to you by Slug-o-Cola! The Slimiest Cola in the Galaxy!" , "this roll brought to you by Zaphod's Own: Pan Galactic Gargle Blaster!" , "oh fine, here's a roll. Lazy." , "thank you for rolling me today!" , "Congrats! You're the free crit winner of the day! NOT."];
    var missEmojiArray = [" :hatched_chick:", " :poop:", " :baby_chick:", " :laughing:", " :frowning:", " :thumbsdown:"];
    var hitEmojiArray = [" :bangbang:", " :clap:", " :rage:", " :hammer:", " :bomb:", " :skull:"];
    var critArray = [" CRIT!", " AWH YEAH BIG CRITS!", " CRITTY DITTY DO!", " MMM SEXY CRIT TIMES!", " CRITATTACK!", " M-M-M-MONSTER KILL!", " SUCH CRIT. MUCH DAMAGE.", " GOING... GOING... GONE!", " YAY BIG NUMBERS!", " NICE CRIT, SEXY.", " YOU DONE GOOD, KID", " CRITALCULAR!", " DOINK!", " NICE ONE, BRUVA!", " MERCY! THAT ROLL GAVE ME THE VAPORS!", " I LIKE THE WAY YOU ROLL, BABY"]
    var missArray = [" YOU SUCK B!", " YOU JUST HIT YOURSELF!", " SLICE! THERE GOES YA PENIS!", " CALL THE MEATWAGON!", " OH NO! YOU SUCK AGAIN!", " BABBY'S FIRST SWORD SWING!"," LOLOLOLOLOLOL REZ INCOMING NUB", " THAT'S RARELY GOOD", " YA DONE GOOFED", " BIFFED IT", " BIFFED IT HARD", " WELL AT LEAST YOUR PARENTS STILL LOVE YOU", " THIS IS WHY WE CAN'T HAVE NICE THINGS", " I CAN'T BELIEVE YOU'VE DONE THIS", " GOOD JOB, [BLIND CELEBRITY NAME HERE]", " RUN, JUST BAIL. FORGET YOUR PARTY MEMBERS." , " DON'T WORRY I'M SURE YOUR PARTY DOESN'T MIND CARRYING YOU", " YOU'LL MAKE A PRETTY CORPSE", " WOULD YOU LIKE YOUR REMAINS VACUUM DESICCATED?" , " THE FLOOR IS COLD, ISN'T IT?"];
    var nameArray = ["ZIMZAMTHEROLLYMAN", "ROLLBOT", "TRANSFORMANDROLLOUTBOT", "BOLLROT", "ROLLYPOLLYOLLYROLLBOT", "ROLLSMAN5000", "CRITOMATIC", "MISSOMATIC", "WAMBAMROLLERMAN", "ROLLYAL WITH CHEESEBOT", "PATCHES O'ROLLIHAN", "ROLLBITCH", "SNAPCRACKLEMITCHANDROLLBOT", "ROLLSLAVE", "BIGDADDYROLLS", "ROLLROLLROLLYOURBOATBOT", "ROLLANDO BLOOM", "ROLLTIDE", "HITOMATIC", "HANDYDANDYROLLBOT", "YOUR FRIENDLY NEIGHBORHOOD ROLLBOT", "ROLLANDY MARSH", "'THE' ROLLHIO STATE UNIVERSITY", "ROLLUMBUSBOT", "ROLLGAZO THE MIGHTY ROLL GOD", "DROLLPH LUNDGREN", "OOO, BAROLLCUDA", "ADROLLPH HITLER", "RNGESUS", "RANDY QUAID", "ROLLO TONY BROWN TOWN", "ROLLNADOBOT", "ROLLNADOBOT II: STILL ROLLING", "ROLLNADOBOT III: SUMMER OF ROLLNADOBOT", "ROLLNADOBOT IV: ROLL OUT", "ROLLNADOBOT V: EASY COME EASY ROLL", "ROLLNADOBOT VI: THE FINAL ROLLDOWN", "ROLLNADOBOT VII: ONE MORE FOR THE ROLL", "ROLLNADOBOT VIII: THE ROLLUNION", "ROLLNADOBOT IX: THE PERFECT ROLL", "ROLLSY O'DONNELL", "TROLLROLLOLBOT", "ROLLTANA", "CAROLLS SANTANA", "CPT SISKROLLS", "USS ENTROLLPRISEBOT", "DEEP ROLLS 9", "RANDOM NUMBER GENERATOR BOT", "BEEPBOOPHERESYOURROLL", "KING GADROLLA", "MECHAGODZIROLLABOT", "GODZILLROLLABOT", "D-BOT", "THE GREAT ROLLBANZO", "VINCENT VAN ROLLBOT", "CRAPPYROLLBOT", "BARCEROLLA FC BOT", "ROLLERDISCOBOT", "ROLLSEPH STALIN", "TEDDY ROLLSEVELT", "FRANKLIN D. ROLLSEVELT", "WINSTROLL CHURCHILL", "BENITROLL MUSSOLINI", "HIDEKI TOROLL", "ROLLEAL MADRIDBOT", "RPBOTSUCKSBOT", "RPBOTISNTSOBADBOT", "RPBOTHASALOTOFGOODQUALITIESBOT", "RPBOTISADICKBOT", "RPBOT&ROLLBOT=BFF4EBOT"]
    var randomMissEmoji = missEmojiArray[Math.floor(Math.random() * missEmojiArray.length)];
    var randomHitEmoji = hitEmojiArray[Math.floor(Math.random() * hitEmojiArray.length)];
    var randomCrit = critArray[Math.floor(Math.random() * critArray.length)] + randomHitEmoji;
    var randomMiss = missArray[Math.floor(Math.random() * missArray.length)] + randomMissEmoji;
    var randomName = nameArray[Math.floor(Math.random() * nameArray.length)];
    var randomGreeting = greetingArray[Math.floor(Math.random() * greetingArray.length)];


    var didCrit = false;
    var didMiss = false;

    var prefix = "/";

    var hasPrefix = msg.content.startsWith(prefix);
    var advRegex = msg.content.match(/\/roll(\s(adv|dis))((\s)?(\-|\+)\s?(\d{1,3}))?((\s?)(\>|\<)\s?(\d{1,3}))?((\s)?\-\s?(.*$))?/);
    var rollRegex = msg.content.match(/\/roll(((\s(\d{1,3})d(\d{1,3}))?((\s?)(\+|\-)\s?(\d{1,3}))?)+)((\s?)(\>|\<)\s?(\d{1,3}))?((\s)?\-\s?(.*$))?/);


    if (!hasPrefix) return;

    if (hasPrefix && msg.content.match(/\/roll help/)) {
        if(msg.content.match(/\/roll help$/)) {
            msg.reply("DM Sent");
            msg.delete();
            msg.author.sendMessage("**PREFIX:**\nAll commands must be prefixed with /roll\n\n**DICE METHOD:**\n*Syntax:* <number>d<sides> *AND/OR* <+/-modifier> *AND/OR* <-message>\n*Examples:\n1d4\n3d6 +3\n2d6 + 3 - message\n1d10 -message\n3d6+1-message*\n\n**DC CHECKS:**\n*Syntax:* <number>d<sides> *AND/OR* <+/-modifier> *AND* [</>]<dc rating> *AND/OR* <-message>\n*Examples:\n1d20 > 15\n3d6 < 10\n+5 > 15\n+ 7 <12 -message*\n\n**ADVTANGE AND DISADVATANGE:**\n*Syntax:* <adv|dis> *AND/OR* <+/-modifier> *AND/OR* [</>]<dc rating> *AND/OR* <-message>\n*Examples:\nadv\ndis +1\nadv + 5 > 15\ndis - 2 < 20 -perception\nadv + 1 - acrobatics*");
        }
    }
    else if (hasPrefix && advRegex) {
        console.log(advRegex);
        var advOrDis = advRegex[2];
        var advOrDisText = "";
        var advModifier;
        var advModifierValue = 0;
        var advGreaterLesser;
        var advDCValue;
        var betterRoll;
        var betterRollModTotal;
        var rollsArray = [];
        var advRegexRollNote = "";
        var rollA = roll(1,die);
        var rollB = roll(1,die);
        console.log(rollA);
        console.log(rollB);
        if(advRegex[3]) {
            advModifier = advRegex[5];
            advModifierValue = Number(advRegex[6]);
        }
        if(advRegex[7]) {
            advGreaterLesser = advRegex[9];
            advDCValue = advRegex[10];
            isDCCheck = true;
        }
        if(advRegex[11]) {
            advRegexRollNote =  " (**" + advRegex[13] + "**)";
        }
        if(advOrDis == "adv") {
            advOrDisText = " *advantage*";
            if (advModifierValue) {
                var unmodifiedTotal = 20;
                if (advModifier == '+') {
                    if(rollA>rollB) {
                        betterRoll = rollA;
                        betterRollModTotal = rollA + advModifierValue;
                    }
                    else {
                        betterRoll = rollB;
                        betterRollModTotal = rollB + advModifierValue;
                    }
                } else if (advModifier == '-') {
                    if(rollA>rollB) {
                        betterRoll = rollA;
                        betterRollModTotal = rollA - advModifierValue;
                    }
                    else {
                        betterRoll = rollB;
                        betterRollModTotal = rollB - advModifierValue;
                    }
                }
                if (betterRoll == 20)  {
                    rollbotTaunt = randomCrit;
                    didCrit = true;
                } else if (betterRoll == 1) {
                    rollbotTaunt = randomMiss;
                    didMiss = true;
                } else {
                    rollbotTaunt = ""
                }
                modifierWrapper = ' (' + advModifier + advModifierValue + ')';
            }
            else {
                if(rollA>rollB) {
                    betterRoll = rollA;
                    betterRollModTotal = rollA;
                }
                else {
                    betterRoll = rollB;
                    betterRollModTotal = rollB;
                }
                if (betterRoll == 20)  {
                    rollbotTaunt = randomCrit;
                    didCrit = true;
                } else if (betterRoll == 1) {
                    rollbotTaunt = randomMiss;
                    didMiss = true;
                } else {
                    rollbotTaunt = ""
                }
            }
        }
        if(advOrDis == "dis") {
            advOrDisText = " *disadvantage*";
            if (advModifierValue) {
                var unmodifiedTotal = 20;

                if (advModifier == '+') {
                    if(rollA>rollB) {
                        betterRoll = rollB;
                        betterRollModTotal = rollB + advModifierValue;
                    }
                    else {
                        betterRoll = rollA;
                        betterRollModTotal = rollA + advModifierValue;
                    }
                } else if (advModifier == '-') {
                    if(rollA>rollB) {
                        betterRoll = rollB;
                        betterRollModTotal = rollB - advModifierValue;
                    }
                    else {
                        betterRoll = rollA;
                        betterRollModTotal = rollA - advModifierValue;
                    }
                }
                if (betterRoll == 20)  {
                    rollbotTaunt = randomCrit;
                    didCrit = true;
                } else if (betterRoll == 1) {
                    rollbotTaunt = randomMiss;
                    didMiss = true;
                } else {
                    rollbotTaunt = ""
                }
                modifierWrapper = ' (' + advModifier + advModifierValue + ')';
            }
            else {
                if(rollA>rollB) {
                    betterRoll = rollB;
                    betterRollModTotal = rollB;
                }
                else {
                    betterRoll = rollA;
                    betterRollModTotal = rollA;
                }
                if (betterRoll == 20)  {
                    rollbotTaunt = randomCrit;
                    didCrit = true;
                } else if (betterRoll == 1) {
                    rollbotTaunt = randomMiss;
                    didMiss = true;
                } else {
                    rollbotTaunt = ""
                }
            }
        }
        if(isDCCheck) {
            if(advGreaterLesser == ">") {
                if(betterRollModTotal >= advDCValue) {
                    dc_pass_fail_message = ' > ' + advDCValue + ' PASS! '; 
                }
                else {
                    dc_pass_fail_message = ' < ' + advDCValue + ' FAIL! ';
                }
            }
            else if(advGreaterLesser == "<") {
                if(betterRollModTotal <= advDCValue) {
                    dc_pass_fail_message = ' < ' + advDCValue + ' PASS! ';
                }
                else {
                    dc_pass_fail_message = ' > ' + advDCValue + ' FAIL! ';
                }
            }
        }
        botPayload.text = 'you rolled a **'+rollA+'** and **'+rollB+'** with' + advOrDisText + advRegexRollNote + '\n' + betterRoll + modifierWrapper + ' = ** ' + betterRollModTotal + dc_pass_fail_message + rollbotTaunt + '**';
        botPayload.username = randomName;
        bot.setNickname(msg, botPayload.username);
        bot.reply(msg, botPayload.text);
        bot.deleteMessage(msg);
    }
    /*! IF ITS A REGULAR ROLL **/
    else if (hasPrefix && rollRegex) {
        var processedRolls = [];
        var formattedDice = [];
        var formattedRollsAndMods = "";
        var grandTotal = null;
        var maxRoll = null;
        var minRoll = null;
        console.log(rollRegex);
        /*! GET FULL USER ENTRY IN CASE OF MULTIROLL **/
        if(rollRegex[1] === "") { /*! HANDLE DEFAULT /ROLL ENTRY **/
            rollRegex[1] = "1d20";
        }
        var userEntry = rollRegex[1];
        /*! CHECK FULL ENTRY FOR INDIVIDUAL ROLLS **/
        var rollsToProcess = userEntry.match(/((\s?(\d{1,3})d(\d{1,3}))?((\s?)(\+|\-)\s?(\d{1,3}))?)/g);
        rollsToProcess.pop();
        console.log(rollsToProcess);
        /*! CHECK TO SEE IF THERE IS ONLY ONE ROLL REQUESTED **/

        rollsToProcess.forEach(function(data) {
            var processRoll = data.match(/((\s?(\d{1,3})d(\d{1,3}))?((\s?)(\+|\-)\s?(\d{1,3}))?)/);
            var times = Number(processRoll[3]) || 1;
            var die = Number(processRoll[4]) || 20;
            var rolls = [];
            var total = 0;
            var modifierWrapper = "";
            var diceWrapper = "";
            minRoll += times * 1;
            if(processRoll[5]) {
                var modifier = processRoll[7];
                var modifier_value = Number(processRoll[8]);
            }
            else {
                console.log('no mod');
                var modifier = null;
                var modifier_value = null;
            }
            for (var i = 0; i < times; i++) {
                var currentRoll = roll(1,die);
                var goodRoll = times * die;
                console.log(currentRoll);
                    rolls.push(currentRoll);
                    total += currentRoll;
                    maxRoll += goodRoll;
            }
            /*! HANDLE MODIFIER **/
            if (modifier_value) {
                if (modifier == '+') {
                    total = total + modifier_value;
                } else if (modifier == '-') {
                    total = total - modifier_value;
                }

                modifierWrapper = ' (' + modifier + modifier_value + ')';
            }
            diceWrapper = times+'d'+die; 
            processedRolls.push({
                'dice':diceWrapper,
                'rolls':rolls,
                'modifier':modifierWrapper,
                'total':total
            });           
        });
        console.log('min: '+minRoll);
        processedRolls.forEach(function(data, i) {
            formattedDice.push(data.dice);
            formattedRollsAndMods += '\n' + '**' + formattedDice[i] + '**' + ': ' + data.rolls.join(' + ') + data.modifier + ' = ' + data.total;
            grandTotal += data.total;
        });
        /*! DETECT CRITS && CRIT MISSES **/
        if (grandTotal === maxRoll) {
            rollbotTaunt = randomCrit;
            randomGreeting = "Oh you're gonna be happy!"
        } else if (grandTotal === minRoll) {
            rollbotTaunt = randomMiss;
            randomGreeting = "Oh you're gonna be pissed!"
        } else {
            rollbotTaunt = "";
        }
        console.log(formattedDice);
        if (rollRegex[10]) {
            greater_or_less = rollRegex[12];
            dc_value = Number(rollRegex[13]);
            isDCCheck = true;
        }
        if(isDCCheck) {
            if(greater_or_less == ">") {
                if(grandTotal >= dc_value) {
                    dc_pass_fail_message = ' > ' + dc_value + ' PASS! '; 
                }
                else {
                    dc_pass_fail_message = ' < ' + dc_value  + ' FAIL! ';
                }
            }
            else if(greater_or_less == "<") {
                if(grandTotal <= dc_value) {
                    dc_pass_fail_message = ' < ' + dc_value + ' PASS! ';
                }
                else {
                    dc_pass_fail_message = ' > ' + dc_value + ' FAIL! ';
                }
            }
        }
        if (rollRegex[14]) {
            rollNote = "(**" + rollRegex[16] + "**)";
        }
        botPayload.text = randomGreeting +' '+ rollNote + formattedRollsAndMods + ' \nTotal: ** ' + grandTotal + dc_pass_fail_message + rollbotTaunt + '**';
        botPayload.username = randomName;
        msg.guild.member(bot.user).setNickname(botPayload.username);
        msg.delete();
        msg.reply(botPayload.text);
    }
});

function roll(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

bot.login(AuthDetails.token);