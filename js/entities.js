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
    setHp: function(hp){
        this._hp = hp;
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
    increaseDefenseValue: function(value){
        value = value || 2;

        this._defenseValue += value;
        Game.sendMessage(this, "You look tougher!");
    },
    increaseMaxHp: function(value){
        value = value || 10;
        this._maxHp += value;
        this._hp += value;
        Game.sendMessage(this, "You like healthier!");
    },
    takeDamage: function(attacker, damage){
        this._hp -= damage;
        if(this._hp <= 0){

            if(this.getName() == 'Gluttony Sin' || this.getName() == 'Lust Sin' || this.getName() == 'Sloth Sin' ||
                this.getName() == 'Envy Sin' || this.getName() == 'Wrath Sin' || this.getName() == 'Greed Sin' ||
                this.getName() == 'Pride Sin') {
                attacker._keys++;
            }

            if(this.getName() == 'Demon'){
                Game.switchScreen(Game.Screen.winScreen);
            }

            Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            if(this.hasMixin(Game.Mixins.PlayerActor)) {
                this.act();
            }else {
                this.getMap().removeEntity(this);
            }

            if(attacker.hasMixin('ExperienceGainer')){
                var exp = this.getMaxHp() + this.getDefenseValue();
                if(this.hasMixin('Attacker')){
                    exp += this.getAttackValue();
                }

                if(this.hasMixin('ExperienceGainer')){
                    exp -= (attacker.getLevel() - this.getLevel()) * 3;
                }

                if(exp > 0){
                    attacker.giveExperience(exp);
                }
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
    increaseAttackValue: function(value){
        value = value || 2;

        this._attackValue += value;
        Game.sendMessage(this, "You looks stronger!");
    },
    attack: function(target){
        if(target.hasMixin('Destructible')){
            var attack = this.getAttackValue();
            var defense = this.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You strike the %s for %d damage!', [target.getName(), damage]);
            Game.sendMessage(this, 'The %s strikes you for %d damage', [this.getName(), damage]);

            if(this.hasMixin('PlayerActor')){
                if(this.getWeapon() != null){
                    if(this.getWeapon().getWeaponHp() > 0){
                        this.getWeapon()._weaponHp -= 3;
                    }else{
                        for(var i = 0; i < this._items.length; i++){
                                if(this._items[i] != undefined && this._items[i] != null){
                                    if(this._items[i]._weaponHp <= 0){
                                        Game.sendMessage(this, 'Your lose your %s!', [this._items[i]._name]);
                                        this.removeItem(i);
                                    }
                                }
                            }
                        this._weapon = null;
                    }
                }
                if(this.getArmor() != null){
                    if(this.getArmor().getWearHp() > 0){
                        this.getArmor()._wearHp -= 3;
                    }else{
                        for(var i = 0; i < this._items.length; i++){
                                if(this._items[i] != undefined && this._items[i] != null){
                                    if(this._items[i]._wearHp <= 0){
                                        Game.sendMessage(this, 'You lose your %s!', [this._items[i]._name]);
                                        this.removeItem(i);
                                    }
                                }
                            }
                        this._armor = null;
                    }
                }
            }
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
    increaseSightRadius: function(value){
        value = value || 1;

        this._sightRadius += value;
        Game.sendMessage(this, "You are more aware of your surroundings!");
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

Game.Mixins.ExperienceGainer = {
    name: 'ExperienceGainer',
    init: function(template){
        this._level = template['level'] || 1;
        this._experience = template['experience'] || 0;
        this._statPointsPerLevel = template ['statPointsPerLevel'] || 1;
        this._statPoints = 0;

        this._statOptions = [];

        this._statOptions.push(['Increase attack value', this.increaseAttackValue]);
        this._statOptions.push(['Increase defense value', this.increaseDefenseValue]);
        this._statOptions.push(['Increase max health', this.increaseMaxHp]);
        this._statOptions.push(['Increase sight range', this.increaseSightRadius]);

    },
    getLevel: function(){
        return this._level;
    },
    getExperience: function(){
        return this._experience;
    },
    getNextLevelExperience: function(){
        return (this._level * this._level) * 10;
    },
    getStatPoints: function(){
        return this._statPoints;
    },
    setStatPoints: function(statPoints){
        this._statPoints = statPoints;
    },
    getStatOptions: function(){
        return this._statOptions;
    },
    giveExperience: function(points){
        var statPointsGained = 0;
        var levelsGained = 0;

        while(points > 0){
            if(this._experience + points >= this.getNextLevelExperience()){
                var usedPoints = this.getNextLevelExperience() - this._experience;
                points -= usedPoints;
                this._level++;
                levelsGained++;
                this._statPoints += this._statPointsPerLevel;
                statPointsGained += this._statPointsPerLevel;
            }else{
                this._experience += points;
                points = 0;
            }
        }
        if(levelsGained > 0){
            Game.sendMessage(this, "You advance to level %d", [this._level]);

            if(this.hasMixin('Destructible')){
                this.setHp(this.getMaxHp());
            }

            if(this.hasMixin('StatGainer')){
                this.onGainLevel();
            }
        }
    }
}

Game.Mixins.RandomStatGainer = {
    name: 'RandomStatGainer',
    groupName: 'StatGainer',
    onGainLevel: function(){
        var statOptions = this.getStatOptions();

        while(this.getStatOptions() > 0){
            statOptions.random()[1].call(this);
            this.setStatPoints(this.getStatPoints() - 1);
        }
    }
}

Game.Mixins.PlayerStatGainer = {
    name: 'PlayerStatGainer',
    groupName: 'StatGainer',
    onGainLevel: function(){
        Game.Screen.gainStatScreen.setup(this);
        Game.Screen.playScreen.setSubScreen(Game.Screen.gainStatScreen);
    }
}

Game.Mixins.GluttonySinActor = Game.extend(Game.Mixins.TaskActor, {
    init: function(template){
        Game.Mixins.TaskActor.init.call(this, Game.extend(template, {
            'tasks': ['increaseAttack', 'spawnSkeleton', 'hunt', 'wander']
        }));
        this._hasGrownArm = false;
    },
    canDoTask: function(task){
        if(task === 'increaseAttack'){
            return this.getHp() <= 20 && !this._hasGrownArm;
        }else if(task === 'spawnSkeleton'){
            return Math.round(Math.random() * 100) <= 10;
        }else{
            return Game.Mixins.TaskActor.canDoTask.call(this, task);
        }
    },
    increaseAttack: function(){
        this._hasGrownArm = true;
        this.increaseAttackValue(5);

        Game.sendMessageNearby(this.getMap(), this.getX(), this.getY(), this.getZ(), 'Attack of ' + this.getName() + ' increase!');
    },
    spawnSkeleton: function(){
        var xOffset = Math.floor(Math.random() * 3) - 1;
        var yOffset = Math.floor(Math.random() * 3) - 1;

        if(!this.getMap().isEmptyFloor(this.getX() + xOffset, this.getY() + yOffset, this.getZ())){
            return;
        }
        var minion = Game.EntityRepository.create('Minion');
        minion.setX(this.getX() + xOffset);
        minion.setY(this.getY() + yOffset);
        minion.setZ(this.getZ());
        this.getMap().addEntity(minion);
    }
})

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
    keys: 0,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper,
            Game.Mixins.ExperienceGainer, Game.Mixins.PlayerStatGainer]
}

Game.WarriorTemplate = {
    character: '@',
    foreground: 'blue',
    type: 'warrior',
    maxHp: 60,
    attackValue: 8,
    sightRadius: 6,
    keys: 0,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper,
            Game.Mixins.ExperienceGainer, Game.Mixins.PlayerStatGainer]
}

Game.MageTemplate = {
    character: '@',
    foreground: 'red',
    type: 'mage',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    keys: 0,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper,
            Game.Mixins.ExperienceGainer, Game.Mixins.PlayerStatGainer]
}

Game.ArcherTemplate = {
    character: '@',
    foreground: 'green',
    type: 'swordman',
    maxHp: 25,
    attackValue: 9,
    sightRadius: 6,
    keys: 0,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper,
            Game.Mixins.ExperienceGainer, Game.Mixins.PlayerStatGainer]
}

Game.NecroTemplate = {
    character: '@',
    foreground: '#DA81F5',
    type: 'necro',
    maxHp: 20,
    attackValue: 10,
    sightRadius: 6,
    keys: 0,
    mixins: [Game.Mixins.PlayerActor, Game.Mixins.Attacker, Game.Mixins.InventoryHolder,
            Game.Mixins.Destructible, Game.Mixins.Sight, Game.Mixins.MessageRecipient, Game.Mixins.Equipper,
            Game.Mixins.ExperienceGainer, Game.Mixins.PlayerStatGainer]
}

Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.EntityRepository.define('Bat',{
    name: 'Bat',
    character: '^',
    foreground: 'white',
    speed: 2000,
    maxHp: 5,
    attackValue: 4,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.ExperienceGainer,
            Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Snake', {
    name: 'Snake',
    character: 's',
    foreground: 'red',
    maxHp: 3,
    attackValue: 2,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible,Game.Mixins.ExperienceGainer,
            Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Beetle', {
    name: 'Beetle',
    character: 'b',
    foreground: 'gray',
    maxHp: 2,
    attackValue: 1,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible,Game.Mixins.ExperienceGainer,
            Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Spider', {
    name: 'Spider',
    character: '*',
    foreground: '#DA81F5',
    maxHp: 2,
    attackValue: 1,
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible,Game.Mixins.ExperienceGainer,
            Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Zombie', {
    name: 'Zombie',
    character: 'z',
    foreground: 'lightgreen',
    maxHp: 6,
    attackValue: 4,
    defenseValue: 5,
    tasks: ['hunt', 'wander'],
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight,
            Game.Mixins.ExperienceGainer, Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Little Demon', {
    name: 'Little Demon',
    character: 'd',
    foreground: 'red',
    maxHp: 4,
    attackValue: 6,
    defenseValue: 2,
    tasks: ['hunt', 'wander'],
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight,
            Game.Mixins.ExperienceGainer, Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
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
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight,
            Game.Mixins.ExperienceGainer, Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Minion', {
    name: 'Minion',
    character: '¤',
    foreground: 'darkgreen',
    maxHp: 3,
    attackValue: 2,
    defenseValue: 2,
    speed: 500,
    tasks: ['hunt', 'wander'],
    mixins: [Game.Mixins.TaskActor, Game.Mixins.Attacker, Game.Mixins.Destructible, Game.Mixins.Sight,
            Game.Mixins.ExperienceGainer, Game.Mixins.RandomStatGainer]
},{
    disableRandomCreation: false
})

Game.EntityRepository.define('Gluttony Sin', {
    name: 'Gluttony Sin',
    character: 'G',
    foreground: 'teal',
    maxHp: 30,
    attackValue: 10,
    defenseValue: 10,
    level: 5,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Lust Sin', {
    name: 'Lust Sin',
    character: 'L',
    foreground: 'teal',
    maxHp: 40,
    attackValue: 20,
    defenseValue: 20,
    level: 7,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Greed Sin', {
    name: 'Greed Sin',
    character: 'G',
    foreground: 'lightblue',
    maxHp: 50,
    attackValue: 30,
    defenseValue: 30,
    level: 9,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Sloth Sin', {
    name: 'Sloth Sin',
    character: 'S',
    foreground: 'teal',
    maxHp: 60,
    attackValue: 40,
    defenseValue: 40,
    level: 11,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Envy Sin', {
    name: 'Envy Sin',
    character: 'E',
    foreground: 'teal',
    maxHp: 70,
    attackValue: 50,
    defenseValue: 50,
    level: 13,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Pride Sin', {
    name: 'Pride Sin',
    character: 'P',
    foreground: 'teal',
    maxHp: 80,
    attackValue: 60,
    defenseValue: 60,
    level: 15,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Wrath Sin', {
    name: 'Wrath Sin',
    character: 'W',
    foreground: 'teal',
    maxHp: 90,
    attackValue: 70,
    defenseValue: 70,
    level: 20,
    sightRadius: 6,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})

Game.EntityRepository.define('Demon', {
    name: 'Demon',
    character: 'Ð',
    foreground: 'darkred',
    maxHp: 150,
    attackValue: 80,
    defenseValue: 80,
    level: 35,
    sightRadius: 20,
    speed: 2500,
    mixins: [Game.Mixins.GluttonySinActor, Game.Mixins.Sight, Game.Mixins.Attacker,
            Game.Mixins.Destructible, Game.Mixins.ExperienceGainer]
},{
    disableRandomCreation: true
})