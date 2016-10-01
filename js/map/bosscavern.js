Game.Map.BossCavern = function(tiles, player){
	Game.Map.call(this, tiles, player);
	this.addEntityAtRandomPosition(player, 0);
	this.addEntityAtRandomPosition(Game.EntityRepository.create('Demon'), 0);
}

Game.Map.BossCavern.extend(Game.Map);
