var configuration = require('./config.json');
var commands = require('./commandList.json');
var tmi = require('tmi.js');

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

	// We want to use the configuration specified in our file
	opts = configuration;

	client = null;
	messageEvent = null;

	automod = this.Automod.off;

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

		if(commandName[0] == "!"){
			// This is just text

			// need to abide by automod
			if(this.automod == Automod.off) return;

			// automod is on, so we need to pass it off to a mod handler


			return;
		}

		// Perform a search for the command
		// We substring to get rid of exclamation
		var trimmedCommand = commandName.substring(1);

		var equalityFunction = (x) => x == trimmedCommand
		// If it exists, it's in one of 3 lists
		var isBasic = commands.BasicCommands.hasOwnProperty(equalityFunction);
		var isComplex = commands.ComplexCommands.hasOwnProperty(equalityFunction);
		var isUtility = commands.UtilityCommands.hasOwnProperty(equalityFunction);

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


	moderate(){
	}

}

module.exports = Bot;