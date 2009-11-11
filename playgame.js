load('src/load.js');
var window = new Window();
var game = new Game({
	canvas: window.canvas
});
var user = game.newPlayer();
game.start();
