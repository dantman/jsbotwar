load('src/load.js');
var window = new Window();
var game = new Game({
	canvas: window.canvas
});
var user = game.newPlayer();
user.addBotType('example-data/hardwoodbot');
user.addBot(new Bot(user.bottypes[0]));
game.start();
