/**
 * Created by bocha on 03/09/2016.
 */

Game.Screen = {};

Game.Screen.startScreen = {
    _name: 'StartScreen',
    enter: function() { console.log("Game Start"); },
    exit: function() { console.log("Exit"); },
    render: function(display){
        display.drawText(1, 1, "%c{RED}7 SINS");
        display.drawText(1, 2, "Press [ENTER] to start!");
    },
    handleInput: function(inputType, inputData){
        if(inputType === 'keydown'){
            if(inputData.keyCode === ROT.VK_RETURN){
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
}

Game.Screen.playScreen = {
    _map: null,
    _player: null,
    _name: 'PlayScreen',
    _gameEnded: false,
    _subScreen: null,
    enter: function(type) {
        var width = 100;
        var height = 48;
        var depth = 6;

        var tiles = new Game.Builder(width, height, depth).getTiles();
        if(type == "mage"){
            this._player = new Game.Entity(Game.MageTemplate);
        }else if(type == "archer"){
            this._player = new Game.Entity(Game.ArcherTemplate);
        }else if(type == "necro"){
            this._player = new Game.Entity(Game.NecroTemplate);
        }else{
            this._player = new Game.Entity(Game.WarriorTemplate);
        }
        this._map = new Game.Map(tiles, this._player);

        this._map.getEngine().start();
    },
    exit: function() { console.log("Exit"); },
    render: function(display){
        if(this._subScreen){
            this._subScreen.render(display);
            return;
        }

        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        var topLeftX = Math.max(0, this._player.getX() - (screenWidth / 2));

        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);

        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));

        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);

        var visibleCells = {};

        var map = this._map;
        var currentDepth = this._player.getZ();

        map.getFov(currentDepth).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(), function(x, y, radius, visibility){
                visibleCells[x + ',' + y] = true;
                map.setExplored(x, y, currentDepth, true);
            });

        for(var x = topLeftX; x < topLeftX + screenWidth; x++){
         for(var y = topLeftY; y < topLeftY + screenHeight; y++){
             if(map.isExplored(x, y, currentDepth)) {
                 var glyph = this._map.getTile(x, y, currentDepth);
                 var foreground = glyph.getForeground();

                 if(visibleCells[x + ',' + y]) {
                     var items = map.getItemsAt(x, y, currentDepth);
                     if (items) {
                         glyph = items[items.length - 1];
                     }

                     if (map.getEntityAt(x, y, currentDepth)) {
                         glyph = map.getEntityAt(x, y, currentDepth);
                     }
                     foreground = glyph.getForeground();
                 }else{
                     foreground = 'gray';
                 }
                     display.draw(x - topLeftX, y - topLeftY, glyph.getChar(), foreground, glyph.getBackground());

                }
             }
         }

        var entities = this._map.getEntities();

        for(var key in entities){
            var entity = entities[key];

            if(entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
            entity.getX() < topLeftX + screenWidth && entity.getY() < topLeftY + screenHeight
            && entity.getZ() == this._player.getZ()){
                if(visibleCells[entity.getX() + ',' + entity.getY()]) {
                    display.draw(entity.getX() - topLeftX, entity.getY() - topLeftY, entity.getChar(), entity.getForeground(), entity.getBackground());
                }
            }
        }

        var messages = this._player.getMessages();
        var messageY = 0;
        for(var i = 0; i < messages.length; i++){
            messageY += display.drawText(0, messageY, '%c{white}%b{black}' + messages[i]);
        }

        //var stats = '%c{white}%b{black}';
        stats = this._player.getHp() + '/' +  this._player.getMaxHp();
        document.getElementById("stats").innerHTML = 'HP: ' + stats;
        document.getElementById("attack").innerHTML = 'Attack: ' + this._player.getAttackValue();
        document.getElementById("defense").innerHTML = 'Defense: ' + this._player.getDefenseValue();
        if(this._player._weapon !== null){
            document.getElementById("weapon").innerHTML = 'Actual Weapon: ' + this._player._weapon._name.toUpperCase();
        }else{
            document.getElementById("weapon").innerHTML = 'Actual Weapon: ---';
        }
        if(this._player._armor){
            document.getElementById("armor").innerHTML = 'Actual Armor: ' + this._player._armor._name.toUpperCase();
        }else{
            document.getElementById("armor").innerHTML = 'Actual Armor: ---';
        }
    },
    move: function(dX, dY, dZ){
        var newX = this._player.getX() + dX;

        var newY = this._player.getY() + dY;

        var newZ = this._player.getZ() + dZ;
        this._player.tryMove(newX, newY, newZ, this._map);
    },
    handleInput: function(inputType, inputData){
        if(this._gameEnded){
            if(inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN){
                Game.switchScreen(Game.Screen.loseScreen);
            }
            return;
        }

        if(this._subScreen){
            this._subScreen.handleInput(inputType, inputData);
            return;
        }

        if(inputType === 'keydown'){
            /*if(inputData.keyCode === ROT.VK_RETURN){
                Game.switchScreen(Game.Screen.winScreen);
            }else if(inputData.keyCode === ROT.VK_ESCAPE){
                Game.switchScreen(Game.Screen.loseScreen);
            }*/

            if(inputData.keyCode === ROT.VK_LEFT){
                this.move(-1, 0, 0);
            }else if(inputData.keyCode === ROT.VK_RIGHT){
                this.move(1, 0, 0);
            }else if(inputData.keyCode === ROT.VK_UP){
                this.move(0, -1, 0);
            }else if(inputData.keyCode === ROT.VK_DOWN){
                this.move(0, 1, 0);
            }else if(inputData.keyCode === ROT.VK_I){
                if(this._player.getItems().filter(function(x){return x;}).length === 0){
                    Game.sendMessage(this._player, "You are not carrying anything!");
                    Game.refresh();
                }else{
                    Game.Screen.inventoryScreen.setup(this._player, this._player.getItems());
                    this.setSubScreen(Game.Screen.inventoryScreen);
                }
                return;
            }else if(inputData.keyCode === ROT.VK_D){
                if(this._player.getItems().filter(function(x){return x;}).length === 0){
                    Game.sendMessage(this._player, "You have nothing to drop!");
                    Game.refresh();
                }else{
                    Game.Screen.dropScreen.setup(this._player, this._player.getItems());
                    this.setSubScreen(Game.Screen.dropScreen);
                }
                return;
            }else if(inputData.keyCode === ROT.VK_W){
                if(inputData.shiftKey){
                    if(this._player.getItems().filter(function(x){return x;}).length === 0){
                        Game.sendMessage(this._player, "You have nothing to wield!");
                        Game.refresh();
                    }else{
                        Game.Screen.wieldScreen.setup(this._player, this._player.getItems());
                        this.setSubScreen(Game.Screen.wieldScreen);
                    }
                }else{
                    if(this._player.getItems().filter(function(x){return x;}).length === 0){
                        Game.sendMessage(this._player, "You have nothing to wear!");
                        Game.refresh();
                    }else{
                        Game.Screen.wearScreen.setup(this._player, this._player.getItems());
                        this.setSubScreen(Game.Screen.wearScreen);
                    }
                }
            }else if(inputData.keyCode === ROT.VK_X){
                var items = this._map.getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());

                if(!items){
                    Game.sendMessage(this._player, "There is nothing here to pick up.");
                }else if(items.length === 1){
                    var item = items[0];
                    if(this._player.pickUpItems([0])){
                        Game.sendMessage(this._player, "You pick up %s.", [item.describeA()]);
                    }else{
                        Game.sendMessage(this._player, "Your inventory is full! Nothing was picked up.");
                    }
                }else{
                    Game.Screen.pickupScreen.setup(this._player, items);
                    this.setSubScreen(Game.Screen.pickupScreen);
                    return;
                }
            }else{
                return;
            }

            this._map.getEngine().unlock();
        }else if(inputType === 'keypress'){
            var keyChar = String.fromCharCode(inputData.charCode);
            if(keyChar === '>'){
                this.move(0,0,1);
            }else if(keyChar === '<'){
                this.move(0,0,-1);
            }else{
                return;
            }
            this._map.getEngine().unlock();
        }
    },
    setGameEnded: function(gameEnded){
        this._gameEnded = gameEnded;
    },
    setSubScreen: function(subScreen){
        this._subScreen = subScreen;
        Game.refresh();
    }
}

Game.Screen.winScreen = {
    enter: function() { console.log("Win game"); },
    exit: function() { console.log("Exit"); },
    render: function(display){
        for(var i = 0; i < 22; i++){
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You Win!");
        }
    },
    handleInput: function(inputType, inputData){
        //
    }
}

Game.Screen.loseScreen = {
    enter: function() { console.log("Lose game"); },
    exit: function() { console.log("Exit"); },
    render: function(display){
        for(var i = 0; i < 22; i++){
            var background = ROT.Color.toRGB([255, 0, 0]);
            display.drawText(2, i + 1, "%b{" + background + "}You Died!");
        }
    },
    handleInput: function(inputType, inputData){
        //
    }
}

Game.Screen.ItemListScreen = function(template){
    this._caption = template['caption'];
    this._okFunction = template['ok'];
    this._canSelectItem = template['canSelect'];
    this._canSelectMultipleItems = template['canSelectMultipleItems'];
    this._isAcceptableFunction = template['isAcceptable'] || function(x){ return x; }
    this._hasNoItemOption = template['hasNoItemOption'];
}

Game.Screen.ItemListScreen.prototype.setup = function(player, items){
    this._player = player;
    
    var c = 0;

    var self = this;

    this._items = items.map(function(item){
        if(self._isAcceptableFunction(item)){
            c++;
            return item;
        }else{
            return null;
        }
    });

    this._selectedIndices = {};
    return c;
}

Game.Screen.ItemListScreen.prototype.render = function(display){
    var letters = 'abcdefghijklmnopqrstuvwxyz';

    display.drawText(0,0, this._caption);

    if(this._hasNoItemOption){
        display.drawText(0,1,'0 - no item');
    }

    var row = 0;
    for(var i = 0; i < this._items.length; i++){
        if(this._items[i]){
            var letter = letters.substring(i, i+1);

            var selectionState = (this._canSelectItem && this._canSelectMultipleItems && this._selectedIndices[i]) ? '+' : '-';
            
            var suffix = '';
            if(this._items[i] === this._player.getArmor()){
                suffix = ' (wearing)';
            }else if(this._items[i] === this._player.getWeapon()){
                suffix = ' (wielding)';
            }

            display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + this._items[i].describe() + suffix);
            row++;
        }
    }
}

Game.Screen.ItemListScreen.prototype.executeOkFunction = function(){
    var selectedItems = {};

    for(var key in this._selectedIndices){
        selectedItems[key] = this._items[key];
    }

    Game.Screen.playScreen.setSubScreen(undefined);

    if(this._okFunction(selectedItems)){
        this._player.getMap().getEngine().unlock();
    }
};

Game.Screen.ItemListScreen.prototype.handleInput = function(inputType, inputData){
    if(inputType === 'keydown'){
        if(inputData.keyCode === ROT.VK_ESCAPE || (inputData.keyCode === ROT.VK_RETURN &&
            (!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))){
            Game.Screen.playScreen.setSubScreen(undefined);
        }else if(inputData.keyCode === ROT.VK_RETURN){
            this.executeOkFunction();
        }else if(this._canSelectItem && this._hasNoItemOption && inputData.keyCode === ROT.VK_0){
            this._selectedIndices = {};
            this.executeOkFunction();
        }else if(this._canSelectItem && inputData.keyCode >= ROT.VK_A && inputData.keyCode <= ROT.VK_Z){
            var index = inputData.keyCode - ROT.VK_A;
            if(this._items[index]){
                if(this._canSelectMultipleItems){
                    if(this._selectedIndices[index]){
                        delete this._selectedIndices[index];
                    }else{
                        this._selectedIndices[index] = true;
                    }

                    Game.refresh();
                }else{
                    this._selectedIndices[index] = true;
                    this.executeOkFunction();
                }
            }
        }
    }
}

Game.Screen.inventoryScreen = new Game.Screen.ItemListScreen({
    caption: 'Inventory',
    canSelect: false
})

Game.Screen.pickupScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the items you wish to pickup',
    canSelect: true,
    canSelectMultipleItems: true,
    ok: function(selectedItems){
        if(!this._player.pickUpItems(Object.keys(selectedItems))){
            Game.sendMessage(this._player, "Your inventory is full! Not all items were picked up.");
        }
        return true;
    }
})

Game.Screen.dropScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish drop',
    canSelect: true,
    canSelectMultipleItems: false,
    ok: function(selectedItems){
        this._player.dropItem(Object.keys(selectedItems)[0]);
        return true;
    }
})

Game.Screen.wieldScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wield',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item){
        return item && item.isWieldable();
    },
    ok: function(selectedItems){
        var keys = Object.keys(selectedItems);
        if(keys.length === 0){
            this._player.unwield();
            Game.sendMessage(this._player, "You are empty handed.");
        }else{
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wield(item);
            Game.sendMessage(this._player, "You are wielding %s.", [item.describeA()]);
        }
        return true;
    }
});

Game.Screen.wearScreen = new Game.Screen.ItemListScreen({
    caption: 'Choose the item you wish to wear',
    canSelect: true,
    canSelectMultipleItems: false,
    hasNoItemOption: true,
    isAcceptable: function(item){
        return item && item.isWearable();
    },
    ok: function(selectedItems){
        var keys = Object.keys(selectedItems);
        if(keys.length === 0){
            this._player.unwield();
            Game.sendMessage(this._player, "You are not wearing anything.");
        }else{
            var item = selectedItems[keys[0]];
            this._player.unequip(item);
            this._player.wear(item);
            Game.sendMessage(this._player, "You are wearing %s.", [item.describeA()]);
        }
        return true;
    }
});