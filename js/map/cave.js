Game.Map.Cave = function(tiles, player){
	Game.Map.call(this, tiles, player);

	this.addEntityAtRandomPosition(player, 0);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Gluttony Sin'), 0);

	for(var z = 0; z < this._depth; z++){
		for(var i = 0; i < 15; i++){
			var entity = Game.EntityRepository.createRandom();
			if(entity._name != 'Gluttony Sin'){
				console.log(entity._name);
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
	this._tiles[this._depth - 1][doorPosition.x][doorPosition.y] = Game.Tile.doorToCavernTile;
};

Game.Map.Cave.extend(Game.Map);