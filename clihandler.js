var commands = require("./commandList.json");
var Bot = require("./bot.js");
const fs = require('fs');
const { exception } = require("console");

exceptions = {
    CommandNotFound:"Command not found",
    BadUsage:"Bad Usage",
}
class CliHandler {
    botReference = null; 
    autoMessageList = []; // the list of asynchronous automessages
    constructor(botReference){
        this.botReference = botReference;
    }
    // Dispatch the calls to more granular functions
    commandTriage(command){
        var fixedCommand = command.toLowerCase();
        var commandList = fixedCommand.split(" ");
        if(commandList.length == 0) return;

        try{
            switch(commandList[0]){
                case "help":
                    if(commandList.length == 1){
                        throw exceptions.BadUsage;
                    }
                    this.getHelpPage(commandList[1]); // display the help page
                    break;
                case "connect":
                    this.botReference.connectToTwitch();
                    break;
                case "automod":
                    if(commandList.length == 1){
                        // Default to strict mode
                        this.botReference.setAutomodStatus(Bot.Automod.strict);
                    }
                    else{
                        var mode = null;
                        switch(commandList[1]){
                            case "strict":
                                mode = Bot.Automod.strict;
                                break;
                            case "warn":
                                mode = Bot.Automod.warn;
                                break;
                            case "off":
                                mode = Bot.Automod.off;
                                break;
                            default:
                                throw exceptions.BadUsage; // not an accepted option
                        }
                        this.botReference.setAutomodStatus(mode);
                    }
                    break;
                case "autoprompt":
                    if(commandList.length == 1){
                        // We need more input
                        throw exceptions.BadUsage;
                    }
                    this.autoMessageRegister(commandList[1], commandList.slice(2).join(" "));
                    break;
                case "say":
                    if(commandList.length == 1){
                        throw exceptions.BadUsage;
                    }
                    this.botReference.say(commandList.splice(1).join(" "));
                    break;
                case "blacklist":
                    if(commandList.length <= 2){
                        throw exceptions.BadUsage;
                    }
                    if(commandList[1] == "add") {
                        this.addToBlacklist(commandList[2]);
                    }
                    else if(commandList[1] == "remove"){
                        this.removeFromBlacklist(commandList[2]);
                    }
                    else{
                        throw exceptions.BadUsage;
                    }
                    break;
                case "disconnect":
                    this.botReference.disconnectFromTwitch(); 
                default:
                    throw exceptions.CommandNotFound;
                    break;
            }
        }
        catch (e){
            console.log(e);
            if(e == exceptions.CommandNotFound){
                // Do we want any additional behavior?
                return;
            }
            else if(e == exceptions.BadUsage){
                console.log("Invoke the command with: " + commands.CommandLine[commandList[0]].usage);
            }
        }
        
    }

    // timer given in seconds
    autoMessageRegister(timer, msg){
        if(!msg) msg = commands.CannedMessages.welcome;

        this.sayHelper(timer,msg);
    }
    sayHelper(timer,msg){
        setTimeout(()=>{
            this.botReference.say(msg);
            this.sayHelper(timer,msg);
        }, timer*1000);
    }
    cancelAllAutoprompts(){

    }
//#region Blacklist
    addToBlacklist(msg){
        fs.readFile('./wordblacklist.json', 'utf-8', (err, data)=>{
            if(err){
                throw err;
            }
            var blacklist = JSON.parse(data.toString());

            blacklist[msg] = msg; // prevents duplicates too :)

            const blackliststr = JSON.stringify(blacklist);
            fs.writeFileSync('./wordblacklist.json', blackliststr);

            this.botReference.reloadBlacklist();
        });
    }
    removeFromBlacklist(msg){
        fs.readFile('./wordblacklist.json', 'utf-8', (err, data)=>{
            if(err){
                throw err;
            }
            var blacklist = JSON.parse(data.toString());
            delete blacklist[msg]; // prevents duplicates too :)

            const blackliststr = JSON.stringify(blacklist);
            fs.writeFileSync('./wordblacklist.json', blackliststr);

            this.botReference.reloadBlacklist();
        });
    }
//#endregion
	getHelpPage(command){
		var commandObj = commands.CommandLine[command];
		console.log(`\nHELP ${command}\nusage: ${commandObj.usage}\nWhat does it do?:${commandObj.manual}`);
	}
}
module.exports = CliHandler;