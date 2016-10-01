/**
 * Created by bocha on 03/09/2016.
 */
Game.Tile = function(properties){
    properties = properties || {};

    Game.Glyph.call(this, properties);

    this._isWalkable = properties['isWalkable'] || false;
    this._isDiggable = properties['isDiggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true
};

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.isWalkable = function(){
    return this._isWalkable;
}

Game.Tile.prototype.isDiggable = function(){
    return this._isDiggable;
}

Game.Tile.prototype.isBlockingLight = function(){
    return this._blocksLight;
}


Game.Tile.nullTile = new Game.Tile({});
Game.Tile.floorTile = new Game.Tile({
    character: '.',
    foreground: 'brown',
    isWalkable: true,
    blocksLight: false
});
Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'orange',
    isDiggable: true
});

Game.Tile.stairsUpTile = new Game.Tile({
   character: '>',
   foreground: 'white',
   isWalkable: true,
   blocksLight: false
});

Game.Tile.stairsDownTile = new Game.Tile({
   character: '<',
   foreground: 'white',
   isWalkable: true,
   blocksLight: false
});

Game.Tile.doorToCavernTile = new Game.Tile({
  character: '+',
  foreground: 'white',
  isWalkable: true,
  blocksLight: false
});

Game.Tile.waterTile = new Game.Tile({
  character: '~',
  foreground: 'blue',
  isWalkable: false,
  blocksLight: false
})

Game.getNeighborPositions = function(x,y){
    var tiles = [];

    for(var dX = -1; dX < 2; dX++){
       for(var dY = -1; dY < 2; dY++) {
           if (dX == 0 && dY == 0) {
                continue;
           }
           tiles.push({x: x+dX, y: y+dY});
       }
    }
    return tiles.randomize();
}