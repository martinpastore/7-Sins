/**
 * Created by bocha on 10/09/2016.
 */
Game.ItemRepository = new Game.Repository('items', Game.Item);

Game.ItemRepository.define('life', {
    name: 'life',
    character: '♥',
    foreground: 'red',
    wearable: false,
    wieldable: false,
	healing: true,
    mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('rock', {
    name: 'rock',
    character: '*',
    foreground: 'lightgray',
    wearable: false,
    wieldable: false,
    mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('dagger', {
	name: 'dagger',
	character: '↨',
	foreground: 'yellow',
	attackValue: 5,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 5,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('sword', {
	name: 'sword',
	character: '╬',
	foreground: 'gray',
	attackValue: 10,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 20,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('staff', {
	name: 'staff',
	character: '/',
	foreground: 'gray',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 15,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('katana', {
	name: 'katana',
	character: ')',
	foreground: 'gray',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'swordman',
	weaponHp: 15,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('magic', {
	name: 'magic',
	character: '&',
	foreground: 'pink',
	attackValue: 9,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 10,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('necro magic', {
	name: 'necro magic',
	character: '&',
	foreground: 'purple',
	attackValue: 9,
	wieldable: true,
	typeWeapon: 'necro',
	weaponHp: 10,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('tunic', {
	name: 'tunic',
	character: '▼',
	foreground: 'brown',
	defenseValue: 4,
	wearable: true,
	wearHp: 20,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('chainmail', {
	name: 'chainmail',
	character: '▼',
	foreground: 'lightgray',
	defenseValue: 6,
	wearable: true,
	wearHp: 30,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('ironmail', {
	name: 'ironmail',
	character: '▼',
	foreground: 'darkgray',
	defenseValue: 8,
	wearable: true,
	wearHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

