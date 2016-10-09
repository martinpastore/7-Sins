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
    character: '•',
    foreground: 'white',
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
	weaponHp: 20,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('sword', {
	name: 'sword',
	character: '╬',
	foreground: 'gray',
	attackValue: 15,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('diamond sword', {
	name: 'diamond sword',
	character: '╬',
	foreground: 'lightblue',
	attackValue: 15,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('platinum sword', {
	name: 'platinum sword',
	character: '╬',
	foreground: '#058C71',
	attackValue: 10,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});


Game.ItemRepository.define('gold sword', {
	name: 'gold sword',
	character: '╬',
	foreground: 'yellow',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('silver sword', {
	name: 'silver sword',
	character: '╬',
	foreground: 'lightgray',
	attackValue: 5,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});


Game.ItemRepository.define('wood sword', {
	name: 'wood sword',
	character: '╬',
	foreground: 'brown',
	attackValue: 3,
	wieldable: true,
	typeWeapon: 'warrior',
	weaponHp: 90,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('staff', {
	name: 'staff',
	character: '/',
	foreground: 'gray',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 40,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('scimitar', {
	name: 'scimitar',
	character: ')',
	foreground: 'green',
	attackValue: 11,
	wieldable: true,
	typeWeapon: 'swordman',
	weaponHp: 60,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('machete', {
	name: 'machete',
	character: ')',
	foreground: 'red',
	attackValue: 6,
	wieldable: true,
	typeWeapon: 'swordman',
	weaponHp: 60,
	mixins: [Game.ItemMixins.Equippable]
});


Game.ItemRepository.define('katana', {
	name: 'katana',
	character: ')',
	foreground: 'gray',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'swordman',
	weaponHp: 60,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('gay magic', {
	name: 'gay magic',
	character: '&',
	foreground: 'pink',
	attackValue: 15,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('fire magic', {
	name: 'fire magic',
	character: '&',
	foreground: 'red',
	attackValue: 10,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('light magic', {
	name: 'light magic',
	character: '&',
	foreground: 'lightyellow',
	attackValue: 8,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('wather magic', {
	name: 'wather magic',
	character: '&',
	foreground: 'blue',
	attackValue: 6,
	wieldable: true,
	typeWeapon: 'mage',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('zombie magic', {
	name: 'zombie magic',
	character: '$',
	foreground: 'lightgreen',
	attackValue: 5,
	wieldable: true,
	typeWeapon: 'necro',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('skeleton magic', {
	name: 'skeleton magic',
	character: '$',
	foreground: 'white',
	attackValue: 5,
	wieldable: true,
	typeWeapon: 'necro',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('necro magic', {
	name: 'necro magic',
	character: '$',
	foreground: 'purple',
	attackValue: 9,
	wieldable: true,
	typeWeapon: 'necro',
	weaponHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('tunic', {
	name: 'tunic',
	character: '▼',
	foreground: 'brown',
	defenseValue: 4,
	wearable: true,
	wearHp: 50,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('chainmail', {
	name: 'chainmail',
	character: '▼',
	foreground: 'lightgray',
	defenseValue: 6,
	wearable: true,
	wearHp: 70,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('gold armor', {
	name: 'gold armor',
	character: '▼',
	foreground: 'darkyellow',
	defenseValue: 7,
	wearable: true,
	wearHp: 80,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('iron armor', {
	name: 'iron armor',
	character: '▼',
	foreground: 'darkgray',
	defenseValue: 8,
	wearable: true,
	wearHp: 100,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('platinum armor', {
	name: 'platinum armor',
	character: '▼',
	foreground: '#058C71',
	defenseValue: 10,
	wearable: true,
	wearHp: 100,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('diamond armor', {
	name: 'diamond armor',
	character: '▼',
	foreground: 'lightblue',
	defenseValue: 12,
	wearable: true,
	wearHp: 120,
	mixins: [Game.ItemMixins.Equippable]
});