Game.Map.Cave = function(tiles, player){
	Game.Map.call(this, tiles, player);
	this.addEntityAtRandomPosition(player, 0);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Gluttony Sin'), 0);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Lust Sin'), 1);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Sloth Sin'), 2);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Greed Sin'), 3);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Envy Sin'), 4);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Pride Sin'), 5);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Wrath Sin'), 6);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Demon'), 7);

	for(var z = 0; z < this._depth; z++){
		for(var i = 0; i < 15; i++){
			var entity = Game.EntityRepository.createRandom();
			if(entity._name != 'Gluttony Sin' && entity._name != 'Lust Sin' && entity._name != 'Sloth Sin'
             && entity._name != 'Pride Sin' && entity._name != 'Wrath Sin' && entity._name != 'Greed Sin' && entity._name != 'Envy Sin'
				&& entity._name != 'Demon'){
				this.addEntityAtRandomPosition(entity, z);
			}
			if(entity.hasMixin('ExperienceGainer')){
				for(var level = 0; level < z; level++){
					entity.giveExperience(entity.getNextLevelExperience() - entity.getExperience());
				}
			}
		}
		for(var i = 0; i < 15; i++){
			this.addItemAtRandomPosition(Game.ItemRepository.createRandom(), z);
		}
	}

	var templates = ['dagger', 'sword', 'staff', 'tunic', 'chainmail', 'ironmail'];
	for(var i = 0; i < templates.length; i++){
		this.addItemAtRandomPosition(Game.ItemRepository.create(templates[i]), Math.floor(this._depth * Math.random()));
	}

	var doorPosition = this.getRandomFloorPosition(this._depth - 1);
	this._tiles[this._depth - 2][doorPosition.x][doorPosition.y] = Game.Tile.doorToCavernTile;
};

Game.Map.Cave.extend(Game.Map);