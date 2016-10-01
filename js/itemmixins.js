Game.ItemMixins = {};

Game.ItemMixins.Equippable = {
	name: 'Equippable',
	init: function(template){
		this._attackValue = template['attackValue'] || 0;
		this._defenseValue = template['defenseValue'] || 0;
		this._wieldable = template['wieldable'] || false;
		this._wearable = template['wearable'] || false;
		this._healing = template['healing'] || false;
		this._typeWeapon = template['typeWeapon'] || null;
	},
	getAttackValue: function(){
		return this._attackValue;
	},
	getDefenseValue: function(){
		return this._defenseValue;
	},
	isWieldable: function(){
		return this._wieldable;
	},
	isWearable: function(){
		return this._wearable;
	},
	isHealing: function(){
		return this._healing;
	},
	isTypeWeapon: function(){
		return this._typeWeapon;
	}
}