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