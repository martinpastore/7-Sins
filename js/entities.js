/**
 * Created by bocha on 03/09/2016.
 */
Game.Mixins = {}

Game.Mixins.Moveable = {
    name: 'Moveable',
    tryMove: function(x, y, z, map){
        var tile = map.getTile(x, y, this.getZ());
        var target = map.getEntityAt(x, y, this.getZ());

        if(z < this.getZ()){
            if(tile != Game.Tile.stairsUpTile){
                Game.sendMessage(this, "You can't go up!");
            }else{
                Game.sendMessage(this, "You ascend to level %d!", [z+1]);
                this.setPosition(x, y, z);
            }
        }else if(z > this.getZ()){
            if(tile != Game.Tile.stairsDownTile){
                Game.sendMessage(this, "You can't go down!");
            }else{
                this.setPosition(x, y, z);
                Game.sendMessage(this, "You descend to level %d!", [z + 1]);
            }
        }else if(target){
            if(this.hasMixin('Attacker')){
                this.attack(target);
                return true;
            }else{
                return false;
            }
        }else if(tile.isWalkable()){
            this.setPosition(x, y, z);
            return true;
        }else if(tile.isDiggable()){
            map.dig(x, y, z);
            return true;
        }
        return false;
    }
}

Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function(template){
        this._maxHp = template['maxHp'] || 10;
        this._hp = template['hp'] || this._maxHp;
        this._defenseValue = template['defenseValue'] || 0;
    },
    getHp: function(){
      return this._hp;
    },
    getMaxHp: function(){
      return this._maxHp;
    },
    getDefenseValue: function(){
      return this._defenseValue;
    },
    takeDamage: function(attacker, damage){
        this._hp -= damage;

        if(this._hp <= 0){
            Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            if(this.hasMixin(Game.Mixins.PlayerActor)) {
                this.act();
            }else {
                this.getMap().removeEntity(this);
            }
        }
    }
}

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',
    act: function(){
        if(this.getHp() < 1){
            Game.Screen.playScreen.setGameEnded(true);
            Game.sendMessage(this, "You died...press [Enter] to continue!");
        }
        Game.refresh();
        this.getMap().getEngine().lock();
        this.clearMessages();
    }
}

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',
    init: function(){
      this._growthsRemaining = 5;
    },
    act: function(){
        if(this._growthsRemaining > 0){
            if(Math.random() <= 0.02){
                var xOffset = Math.floor(Math.random() * 3) - 1;
                var yOffset = Math.floor(Math.random() * 3) - 1;

                if(xOffset != 0 || yOffset != 0){
                    if(this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() +  yOffset, this.getZ())){
                        var entity = new Game.Entity('Fungus');
                        entity.setPosition(this.getX() + xOffset, this.getY() + yOffset, this.getZ());
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;

                        Game.sendMessageNearby(this.getMap(), entity.getX(), entity.getY(), entity.getZ(),'The fungus is spreading!');
                    }
                }
            }
        }
    }
}

Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',
    init: function(template){
        this._attackValue = template['attackValue'] || 1;
    },
    getAttackValue: function(){
        return this._attackValue;
    },
    attack: function(target){
        if(target.hasMixin('Destructible')){
            var attack = this.getAttackValue();
            var defense = this.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You strike the %s for %d damage!', [target.getName(), damage]);
            Game.sendMessage(this, 'The %s strikes you for %d damage', [this.getName(), damage]);

            target.takeDamage(this, damage);
        }
    }
}

Game.Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function(template){
        this._messages = [];
    },
    receiveMessage: function(message){
        this._messages.push(message);
    },
    getMessages: function(){
        return this._messages;
    },
    clearMessages: function(){
        this._messages = [];
    }
}

Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',
    init: function(template){
        this._sightRadius = template['sightRadius'] || 5;
    },
    getSightRadius: function(){
        return this._sightRadius;
    }
}

Game.Mixins.WanderActor = {
    name: 'WanderActor',
    groupName: 'Actor',
    act: function(){
        var movOffset = (Math.round(Math.random()) === 1) ? 1 : -1;

        if(Math.round(Math.random()) === 1){
            this.tryMove(this.getX() + movOffset, this.getY(), this.getZ());
        }else{
            this.tryMove(this.getX(), this.getY + movOffset, this.getZ());
        }
    }
}

Game.Mixins.InventoryHolder = {
    name: 'InventoryHolder',
    init: function(template){
        var inventorySlots = template['inventorySlots'] || 10;
        this._items = new Array(inventorySlots);
    },
    getItems: function(){
        return this._items;
    },
    getItem: function(i){
      return this._items[i]
    },
    addItem: function(item){
        for(var i = 0; i < this._items.length; i++){
            if(!this._items[i]){
                this._items[i] = item;
                return true;
            }
        }
        return false;
    },
    removeItem: function(i){
        this._items[i] = null;
    },
    canAddItem: function(){
        for(var i = 0; i < this._items.length; i++){
            if(!this._items[i]){
                return true;
            }
        }
        return false;
    },
    pickUpItems: function(indices){
        var mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
        var added = 0;

        for(var i = 0; i < indices.length; i++){
            if(this.addItem(mapItems[indices[i] - added])){
                mapItems.splice([indices[i] - added], 1);
                added++;
            }else{
                break;
            }
        }
        this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);
        return added === indices.length;
    },
    dropItem: function(i){
        if(this._items[i]){
            if(this._map){
                this._map.addItem(this.getX(), this.getY(), this.getZ(), this._items[i]);
            }
            this.removeItem(i);
        }
    }
}

Game.sendMessage = function(recipient, message, args){
    if(recipient.hasMixin(Game.Mixins.MessageRecipient)){
        if(args){
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
}

Game.sendMessageNearby = function(map, centerX, centerY, centerZ, message, args){
    if(args){
        message = vsprintf(message, args);
    }

    var entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);

    for(var i = 0; i < entities.length; i++){
        if(entities[i].hasMixin(Game.Mixins.MessageRecipient)){
            entities[i].receiveMessage(message);
        }
    }
}

Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient]
}

Game.WarriorTemplate = {
    character: '@',
    foreground: 'blue',
    maxHp: 60,
    attackValue: 8,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient]
}

Game.MageTemplate = {
    character: '@',
    foreground: 'red',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient]
}

Game.ArcherTemplate = {
    character: '@',
    foreground: 'green',
    maxHp: 25,
    attackValue: 9,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient]
}

Game.NecroTemplate = {
    character: '@',
    foreground: '#DA81F5',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient]
}

Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('Fungus',{
    name: 'Fungus',
    character: 'F',
    foreground: 'green',
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
})

Game.EntityRepository.define('Bat',{
    name: 'Bat',
    character: '^',
    foreground: 'white',
    maxHp: 5,
    attackValue: 4,
    mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker, Game.Mixins.Destructible]
})

Game.EntityRepository.define('Newt', {
    name: 'Newt',
    character: '~',
    foreground: 'red',
    maxHp: 3,
    attackValue: 2,
    mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker, Game.Mixins.Destructible]
})