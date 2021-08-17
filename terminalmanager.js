const blessed = require("blessed");

class TerminalManager{
    botInstance = null;
    cliInstance = null;
    constructor(botInstance, cliInstance){
        this.botInstance = botInstance;
        this.cliInstance = cliInstance;
        this.initialize();
    }
    initialize(){
        // rolled back blessed 
        var screen = blessed.screen({
            smartCSR:true,
            title:"Twitch Control Panel",
            forceUnicode: true,
            debug:true
        });
        var leftcolumn = blessed.box({
            top:'0%',
            left:'0%',
            width:'50%-2',
            height:'l00%-3',
            tags: true,
            content: "{bold}Left{/bold} Column",
            border:{
                type: 'fg'
            },
            style:{
                fg: 'white',
                border:{
                    fg: "magenta"
                }
            }
        });
        var inputbox = blessed.input({
            top:'100%-3',
            left: '0%',
            height: '3',
            width: '50%-2',
            tags: true,
            content: '{bold}Enter command...{/bold}'
        });
        screen.append(leftcolumn);
        screen.append(inputbox);

        var rightcolumn = blessed.box({
            top:'0%',
            left:'50%+1',
            width:'50%-2',
            height:'100%',
            tags: true,
            content: "{bold}Right{/bold} Column",
            border:{
                type: 'fg'
            },
            style:{
                fg: 'white',
                border:{
                    fg: "magenta"
                }
            }
        });
        screen.append(rightcolumn);

        leftcolumn.on('click', function(data){
            leftcolumn.setContent("You clicked me!");
            leftcolumn.focus();
            screen.render();
        });
        rightcolumn.on('click', function(data){
            rightcolumn.setContent("You clicked me!");
            rightcolumn.focus();
            screen.render();
        });
        inputbox.on('click', function(data){
            inputbox.focus();
            screen.render();
        })
        inputbox.key('enter', function(data){
            inputbox.setContent("");
            screen.render();
        })

        screen.on('render', ()=>{
            screen.deleteTop(0,0);
        });

        screen.render();

    }
    handleCommand(data){
        
    }
    destroy(){
        this.screen.destroy();
    }
}
module.exports = TerminalManager;