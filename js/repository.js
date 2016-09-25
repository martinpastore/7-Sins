/**
 * Created by bocha on 10/09/2016.
 */
Game.Repository = function(name, ctor){
    this._name = name;
    this._templates = {};
    this._ctor = ctor;
    this._randomTemplates = {};
}

Game.Repository.prototype.define = function(name, template, options){
    this._templates[name] = template;

    var disableRandomCreation = options && options['disableRandomCreation'];

    if(!disableRandomCreation){
        this._randomTemplates[name] = template;
    }
}

Game.Repository.prototype.create = function(name){
    var template = this._templates[name];

    if(!template){
        throw new Error("No template named '" + name + "' in repository '" + this._name + "'");
    }

    return new this._ctor(template);
}

Game.Repository.prototype.createRandom = function(){
    return this.create(Object.keys(this._templates).random());
}