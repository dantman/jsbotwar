
function BotConfigError(message) {
	this.message = message;
}
BotConfigError.prototype = Object.create(Error.prototype);
BotConfigError.prototype.toString = function toString() { return this.message; };

load('src/player.js');
load('src/factory.js');
load('src/part.js');
load('src/bot.js');

function Game(o) {
	this.players = [];
	this.canvas = false;
	this.viewport = { x: 0, y: 0 };
	if ( o )
		Object.merge(this, o);
}
Object.merge(Game.prototype, {
	start: function start() {
		this.spawn(); // spawn and start running the game threads
		this.play(); // run the game ui in this thread
	},
	spawn: function spawn() {
		var {Runnable, Thread, ThreadGroup} = java.lang;
		for each ( let player in this.players ) {
			(function() {
				var r = new Runnable(function() {
					// factory thread
					
				});
				var t = new Thread(r, player.id+"-factory");
				t.setDaemon(true);
				t.start();
			})();
			
			(function() {
				var r = new Runnable({
					run: function() {
						// bot thread
						var ms = 100;
						while(true) {
							Thread.currentThread().sleep(ms);
							for each ( var bot in player.bots ) {
								bot.runLogicSegment(ms);
								bot.theta = bot.theta % 360;
								print(bot.x, bot.y, bot.theta);
							}
						}
					}
				});
				var t = new Thread(r, player.id+"-bots");
				t.setDaemon(true);
				t.start();
			})();
		}
	},
	play: function play() {
		var game = this;
		for each ( var player in this.players ) {
			player.factory = new Factory(player);
		}
		var dirt = new Image('img/dirt.gif');
		this.canvas.render = function() {
			var ctx = this.getContext('2d');
			var w = this.width, h = this.height;
			var view = {
				x: game.viewport.x-w/2,
				y: game.viewport.y-h/2
			};
			
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, w, h);
			
			for(var y = 0; y < h; y += dirt.height) {
				for(var x = 0; x < w; x += dirt.width) {
					ctx.drawImage(dirt, x, y);
				}
			}
			
			for each(var player in game.players) {
				for each(var bot in player.bots) {
					ctx.fillStyle = "black";
					ctx.fillRect(bot.x-5-view.x, bot.y-5-view.y, 10, 10);
				}
			}
			
		};
		this.canvas.refresh();
		setInterval(function() { this.render(); this.refresh(); }.bind(this.canvas), 250);
		runAllAsync();
	},
	
	newPlayer: function newPlayer(name) {
		var p = new Player(name);
		p.id = "Player"+this.players.push(p);
		return p;
	}
});

