/**
 * Created by bocha on 03/09/2016.
 */
var Game = {
    _display: null,
    _displayStartScreen: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,
    _type: null,

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
            console.log(this._type);
            this._currentScreen.enter(this._type);
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

window.onclick = function(e){
    console.log("GameInit::Click");
    if(!ROT.isSupported()){
        console.log("This browser don't support ROT.JS");
    }else{
        var t = e.target;
        if(t.id == "mage"){
            Game._type = "mage";
        }else if(t.id == "archer"){
            Game._type = "archer";
        }else if(t.id == "necro"){
            Game._type = "necro";
        }else if(t.id == "warrior"){
            Game._type = "warrior";
        }
        document.getElementById("tbl_select").remove();
        Game.init();
        document.body.appendChild(Game.getDisplay().getContainer());
        Game.switchScreen(Game.Screen.startScreen);
    }
}