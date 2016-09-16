/**
 * Created by bocha on 03/09/2016.
 */
Game.Glyph = function(properties){
    this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';

    this._attachedMixins = {};
    this._attachedMixinGroups = {};

    var mixins = properties['mixins'] || [];

    for(var i = 0; i < mixins.length; i++){
    	for(var key in mixins[i]){
    		if(key != 'init' && key != 'name' && !this.hasOwnProperty(key)){
    			this[key] = mixins[i][key];
    		}
    	}

    	this._attachedMixins[mixins[i].groupName] = true;

    	if(mixins[i].groupName){
    		this._attachedMixinGroups[mixins[i].groupName] = true;
    	}

    	if(mixins[i].init){
    		mixins[i].init.call(this, properties);
    	}
    }
};

Game.Glyph.prototype.getChar = function(){
    return this._char;
}
Game.Glyph.prototype.getBackground = function(){
    return this._background;
}
Game.Glyph.prototype.getForeground = function(){
    return this._foreground;
}

Game.Glyph.prototype.hasMixin = function(obj){
	if(typeof obj === 'object'){
		return this._attachedMixins[obj.name];
	}else{
		return this._attachedMixins[obj] || this._attachedMixinGroups[obj]
	}
}