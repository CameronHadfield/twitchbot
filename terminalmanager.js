const blessed = require('blessed');

class TerminalManager{
    screen = null;
    terminalbox = null;
    terminalinput = null;
    chatbox = null;

    botInstance = null;
    cliInstance = null;
    constructor(botInstance, cliInstance){
        this.botInstance = botInstance;
        this.cliInstance = cliInstance;
        this.initialize();
    }
    initialize(){
        this.screen = blessed.screen({
            smartCSR: true
        }) 
        this.screen.title = "Twitchbot"
        var terminalBox = blessed.box({
            top:'0%',
            left:'0%',
            width: '50%',
            height: '100%',
            content: "This is the terminal window"
        });
        var input = blessed.textbox({
            parent:terminalBox,
            top: '100%-3',
            border: 'line',
            style:{
                border:{
                    fg:'white'
                }
            }
        });
        this.terminalbox = terminalBox;
        this.terminalinput = input;
        this.screen.append(terminalBox);

        var chatBox = blessed.box({
            top:'0%',
            left:'50%',
            width: '50%',
            height: '100%',
            content: "This is the chat window",
            fg: 'green'
        });
        this.chatbox = chatBox;
        this.screen.append(chatBox);

        input.focus();

        this.screen.render();
    }

    destroy(){
        this.screen.destroy();
    }
}
module.exports = TerminalManager;