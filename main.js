var bot = require("./bot.js");
var readline = require("readline");
var cli = require("./clihandler.js");
var terminalmanager = require("./terminalmanager.js");

const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

var botInstance = new bot();
var cliInstance = new cli(botInstance);
var terminalManager = new terminalmanager(botInstance, cliInstance);

mainLoop();

// Functions

function mainLoop(){
    // now handled by the terminalmanager
    //getInput();
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