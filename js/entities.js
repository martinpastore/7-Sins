/**
 * Created by bocha on 03/09/2016.
 */
Game.Mixins = {}

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
      var modifier = 0;

      if(this.hasMixin(Game.Mixins.Equipper)){
        if(this.getArmor()){
            modifier += this.getArmor().getDefenseValue();
        }
      }  
      return this._defenseValue + modifier;
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
        var modifier = 0;

        if(this.hasMixin(Game.Mixins.Equipper)){
            if(this.getWeapon()){
                modifier += this.getWeapon().getAttackValue();
            }
        }
        return this._attackValue + modifier;
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
    },
    canSee: function(entity){
        if(!entity || this._map !== entity.getMap() || this._z !== entity.getZ()){
            return false;
        }

        var otherX = entity.getX();
        var otherY = entity.getY();

        if((otherX - this._x) * (otherX - this._x) + (otherY - this._y) * (otherY - this._y) > this._sightRadius * this._sightRadius){
            return false;
        }

        var found = false;

        this.getMap().getFov(this.getZ()).compute(
            this.getX(), this.getY(), this.getSightRadius(), function(x, y, radius, visibility){
                if(x === otherX && y === otherY){
                    found = true;
                }
            });
        return found;
    }
}

Game.Mixins.TaskActor = {
    name: 'TaskActor',
    groupName: 'Actor',
    init: function(template){
        this._tasks = template['tasks'] || ['wander']
    },
    act: function(){
        for(var i = 0; i < this._tasks.length; i++){
            if(this.canDoTask(this._tasks[i])){
                this[this._tasks[i]]();
                return;
            }
        }
    },
    canDoTask: function(task){
        if(task === 'hunt'){
            return this.hasMixin('Sight') && this.canSee(this.getMap().getPlayer());
        }else if(task === 'wander'){
            return true;
        }else{
            throw new Error('Tried to perform undefined task ' + task);
        }
    },
    hunt: function(){
        var player = this.getMap().getPlayer();

        var offsets = Math.abs(player.getX() - this.getX()) + Math.abs(player.getY() - this.getY());
        if(offsets === 1){
            if(this.hasMixin('Attacker')){
                this.attack(player);
                return;
            }
        }

        var source = this;
        var z = source.getZ();
        var path = new ROT.Path.AStar(player.getX(), player.getY(), function(x, y){
            var entity = source.getMap().getEntityAt(x, y, z);
            if(entity && entity !== player && entity !== source){
                return false;
            }
            return source.getMap().getTile(x, y, z).isWalkable();
        }, {topology: 4});

        var c = 0;
        path.compute(source.getX(), source.getY(), function(x, y){
            if(c == 1){
                source.tryMove(x, y, z);
            }
            c++;
        });
    },
    wander: function(){
        var movOffset = (Math.round(Math.random()) === 1) ? 1 : -1;

        if(Math.round(Math.random()) === 1){
            this.tryMove(this.getX() + movOffset, this.getY(), this.getZ());
        }else{
            this.tryMove(this.getX(), this.getY() + movOffset, this.getZ());
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
        if(this._items[i] && this.hasMixin(Game.Mixins.Equipper)){
            this.unequip(this._items[i]);
        }
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

Game.Mixins.Equipper = {
    name: 'Equipper',
    init: function(template){
        this._weapon = null;
        this._armor = null;
    },
    wield: function(item){
        this._weapon = item;
    },
    unwield: function(){
        this._weapon = null;
    },
    wear: function(item){
        this._armor = item;
    },
    takeOff: function(){
        this._armor = null;
    },
    getWeapon: function(){
        return this._weapon;
    },
    getArmor: function(){
        return this._armor;
    },
    unequip: function(item){
        if(this._weapon === item){
            this.unwield();
        }
        if(this._armor === item){
            this.takeOff();
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
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper]
}

Game.WarriorTemplate = {
    character: '@',
    foreground: 'blue',
    maxHp: 60,
    attackValue: 8,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper]
}

Game.MageTemplate = {
    character: '@',
    foreground: 'red',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper]
}

Game.ArcherTemplate = {
    character: '@',
    foreground: 'green',
    maxHp: 25,
    attackValue: 9,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper]
}

Game.NecroTemplate = {
    character: '@',
    foreground: '#DA81F5',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper]
}

Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('Fungus',{
    name: 'Fungus',
    character: 'F',
    foreground: 'green',
    speed: 250,
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
})

Game.EntityRepository.define('Bat',{
    name: 'Bat',
    character: '^',
    foreground: 'white',
    speed: 2000,
    maxHp: 5,
    attackValue: 4,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible]
})

Game.EntityRepository.define('Snake', {
    name: 'Snake',
    character: '~',
    foreground: 'red',
    maxHp: 3,
    attackValue: 2,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible]
})

Game.EntityRepository.define('Zombie', {
    name: 'Zombie',
    character: 'z',
    foreground: 'lightgreen',
    maxHp: 6,
    attackValue: 4,
    defenseValue: 5,
    tasks: ['hunt', 'wander'],
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight]
})

Game.EntityRepository.define('Skeleton', {
    name: 'Skeleton',
    character: 'k',
    foreground: 'white',
    maxHp: 5,
    attackValue: 4,
    defenseValue: 6,
    speed: 500,
    tasks: ['hunt', 'wander'],
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight]
})