var bot = require("./bot.js");
var readline = require("readline");
var cli = require("./clihandler.js");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

var botInstance = new bot();
var cliInstance = new cli(botInstance);

mainLoop();

// Functions

function mainLoop(){
    getInput();
}

function getInput(){
    rl.question("Please enter a command: ", (answer)=>{
        if(answer == "exit"){
            console.log("Exiting...");
            rl.close();
            return;
        }
        cliInstance.commandTriage(answer);
        getInput();
    });
}