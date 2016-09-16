/**
 * Created by bocha on 10/09/2016.
 */
Game.ItemRepository = new Game.Repository('items', Game.Item);

Game.ItemRepository.define('life', {
    name: 'life',
    character: '♥',
    foreground: 'red'
});

Game.ItemRepository.define('rock', {
    name: 'rock',
    character: '*',
    foreground: 'lightgray'
});

Game.ItemRepository.define('dagger', {
	name: 'dagger',
	character: '↨',
	foreground: 'yellow',
	attackValue: 5,
	wieldable: true,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('sword', {
	name: 'sword',
	character: '╬',
	foreground: 'gray',
	attackValue: 10,
	wieldable: true,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('staff', {
	name: 'staff',
	character: '/',
	foreground: 'gray',
	attackValue: 8,
	wieldable: true,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('tunic', {
	name: 'tunic',
	character: '▼',
	foreground: 'brown',
	defenseValue: 4,
	wearable: true,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('chainmail', {
	name: 'chainmail',
	character: '▼',
	foreground: 'lightgray',
	defenseValue: 6,
	wearable: true,
	mixins: [Game.ItemMixins.Equippable]
});

Game.ItemRepository.define('ironmail', {
	name: 'ironmail',
	character: '▼',
	foreground: 'darkgray',
	defenseValue: 8,
	wearable: true,
	mixins: [Game.ItemMixins.Equippable]
});

