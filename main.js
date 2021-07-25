var bot = require("./bot.js");
var readline = require("readline");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

var botInstance = new bot();
mainLoop();

function mainLoop(){

    var exit = false;
    getInput();
}

function getInput(){

        rl.question("Please enter a command: ", (answer)=>{
            if(answer == "exit"){
                exit = true;

                console.log("Exiting...");
                rl.close();
            }
            commandHandler(answer);
            getInput();
        });

}

function commandHandler(command){
    var fixedCommand = command.toLowerCase();
    var commandList = fixedCommand.split(" ");

    if(commandList.length == 0) return;

    switch(commandList[0]){
        case "help":
            break;
        case "connect":
            connectToTwitch();
            break;
        case "automod":
            if(commandList.length == 1){
                // Default to strict mode
            }
        default:
            break;
    }
}
function connectToTwitch(){
    botInstance.connectToTwitch();
    console.log("Connected to twitch");
}