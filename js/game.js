/**
 * Created by bocha on 03/09/2016.
 */
var tileSet = document.createElement("img");
tileSet.src = "img/tiles.png";


var Game = {
    _display: null,
    _displayStartScreen: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,

    init: function(){
        var self = this;
        this._display = new ROT.Display({width: this._screenWidth, height: this._screenHeight + 1});//this.options;

        var game = this;
        var bindEventToScreen = function(event){
            window.addEventListener(event, function(e){
                if(game._currentScreen !== null){
                    game._currentScreen.handleInput(event, e);
                }
            });
        }
        bindEventToScreen('keydown');
        //bindEventToScreen('keyup');
        bindEventToScreen('keypress');
    },

    refresh: function(){
        this._display.clear();
        this._currentScreen.render(this._display);
    },

    getDisplay: function(){
        return this._display;
    },

    switchScreen: function(screen){
        if(this._currentScreen !== null){
            this._currentScreen.exit();
        }

        this.getDisplay().clear();

        this._currentScreen = screen;
        if(!this._currentScreen !== null){
            this._currentScreen.enter();
            this.refresh();
        }
    },

    getScreenWidth: function(){
        return this._screenWidth;
    },

    getScreenHeight: function(){
        return this._screenHeight;
    }
}

window.onclick = function(){
    if(!ROT.isSupported()){
        console.log("This browser don't support ROT.JS");
    }else{
        document.body.innerHTML = "";
        Game.init();
        document.body.appendChild(Game.getDisplay().getContainer());
        Game.switchScreen(Game.Screen.startScreen);
    }
}