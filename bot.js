var configuration = require('./config.json');
var commands = require('./commandList.json');
var tmi = require('tmi.js');
const { stat } = require('fs');
var fs = require('fs');

class Bot{
	// connection options
	static BotStatus = {
		online: "Online",
		connected: "Connected",
		offline: "Offline",
		error: "Error"
	}
	// Automod parameters
	static Automod = {
		off: "off",
		warn: "warn",
		strict: "strict"
	}

	blacklist = null;

	// We want to use the configuration specified in our file
	opts = configuration;

	client = null;
	messageEvent = null;

	automod = Bot.Automod.strict;

	// Stats about the number of messages the bot has dealt with
	messagesHandled = {
		text: 0,
		basic: 0,
		complex: 0,
		utility: 0
	}

	constructor(messageEvent = null){
		this.messageEvent = messageEvent;

		this.onMessageHandler = this.onMessageHandler.bind(this);
		this.onConnectedHandler = this.onConnectedHandler.bind(this);

		this.client = new tmi.Client(this.opts);
		this.client.on('message', this.onMessageHandler);
		this.client.on('connected', this.onConnectedHandler);
	}

	// Connect the bot to the chat
	connectToTwitch(){
		this.client.connect().catch(this.botError);
	}

	botError(){
	}

	// This is the entrypoint for the message handling system
	// Should only contain a switch statement
	onMessageHandler (target, context, msg, self) {
		if (self) { return; } // Ignore messages from the bot

		if(this.messageEvent){
			this.messageEvent(context, msg);
		}
		// Remove whitespace from chat message
		const commandName = msg.trim();

		if(!commandName[0] != '!'){
			// need to abide by automod
			if(this.automod == Bot.Automod.off) return;
			// automod is on, so we need to pass it off to a mod handler
			this.moderate(target, context, msg);

			return;
		}

		// Perform a search for the command
		// We substring to get rid of exclamation
		var trimmedCommand = commandName.substring(1);

		var equalityFunction = (x) => x == trimmedCommand
		// If it exists, it's in one of 3 lists
		var isBasic = commands.BasicCommands[trimmedCommand]!= null;
		var isComplex = commands.ComplexCommands[trimmedCommand]!= null;
		var isUtility = commands.UtilityCommands[trimmedCommand]!= null;

		if(isBasic){
			// Just print
			this.client.say(target,commands.BasicCommands[trimmedCommand]);
		}
		else if(isComplex){
			// NOT IMPLEMENTED		
		}
		else if(isUtility){
			// NOT IMPLEMENTED	
		}
		else{
			// Handle
			console.log("Unsupported Command");
		}
	}

	onConnectedHandler (addr, port) {
		console.log(`* Connected to ${addr}:${port}`);
	}

	setAutomodStatus(status){
		if(status == "") status = Bot.Automod.strict; // default to strict, for safety
		this.automod = status;
	}

	say(msg){ //defaults to the main channel
		this.client.say(this.opts.channels[0], msg);
	}


	moderate(target, context, msg){
		// test all words in the message
		var splitMsg = msg.split(" ");
		var actionRequired = false;
		
		var index = 0;
		while(!actionRequired && index < splitMsg.length){
			if(this.blacklist[splitMsg[index]] != null) actionRequired = true;
			index++;
		}
		if(!actionRequired) return; // get out as soon as possible

		if(this.automod == Bot.Automod.strict){
			// immediately delete the message
			this.client.deletemessage(target, context.id).then((data)=>{
				console.log("Deleted a message"); //output to a log file somewhere maybe?
			}).catch((err)=>{
				console.log("Fix your perms");
			});
		}
		else if(this.automod == Bot.Automod.warn){
			// what should we do here?
		}
	}

	reloadBlacklist(){
		fs.readFile('./wordblacklist.json', (err, data)=>{
			if(err){
				throw err;
			}
			
			this.blacklist = JSON.parse(data.toString());
		})
	}

	getStatus(){

	}

}

module.exports = Bot;