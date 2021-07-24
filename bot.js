var configuration = require('config.json');
var tmi = require('tmi.js');

class Bot{
	// connection options
	static BotStatus = {
		online: "Online",
		connected: "Connected",
		offline: "Offline",
		error: "Error"
	}
	opts = configuration;

	client = null;

	messageHandler = null;
	eventHandler = null;

	constructor(eventHandler, messageHandler){
		this.messageHandler = messageHandler;
		this.eventHandler = eventHandler;

		this.onMessageHandler = this.onMessageHandler.bind(this);
		this.onConnectedHandler = this.onConnectedHandler.bind(this);

		this.client = new tmi.Client(this.opts);
		this.client.on('message', this.onMessageHandler);
		this.client.on('connected', this.onConnectedHandler);
	}

	connectToTwitch(){
		this.client.connect().catch(this.botError);
		this.eventHandler(Bot.BotStatus.connected);
	}

	botError(){
		this.eventHandler(Bot.BotStatus.error);
	}

	onMessageHandler (target, context, msg, self) {
		if (self) { return; } // Ignore messages from the bot

		if(this.messageHandler){
			this.messageHandler(context, msg);
		}

		// Remove whitespace from chat message
		const commandName = msg.trim();

		// If the command is known, let's execute it
		switch(commandName){
			case '!hello':
				this.client.say(target, 'Hey there!')
				break;
			case '!whoami':
				this.client.say(target, 'I am Fridge Theorem!')
				break;
			case '!fridgetheorem':
				this.client.say(target, 
					'The fridge theorem is a corollary of di\'s lemma, which states: if you own a refrigerator, and it\'s running, you\'d better go catch it')
				break;
			case '!help':
				this.client.say(target,
					"The supported commands are: !hello, !whoami, !fridgetheorem")
				break;
			default:
				break;
		}
	}

	onConnectedHandler (addr, port) {
		console.log(`* Connected to ${addr}:${port}`);
	}


}
export default Bot;
