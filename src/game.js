
function Game(o) {
	this.players = [];
	this.canvas = false;
	if ( o )
		Object.merge(this, o);
}
Object.merge(Game.prototype, {
	start: function() {
		this.spawn(); // spawn and start running the game threads
		this.play(); // run the game ui in this thread
	},
	spawn: function() {
		var {Thread, ThreadGroup} = java.lang;
		for each ( var player in this.players ) {
			var tg = new ThreadGroup(player.id);
			tg.setDaemon(true); // game threads shouldn't stay running if the main thread dies
			
			var t = new Thread(tg, function() {
				// factory thread
				
			});
			t.start();
			
			var t = new Thread(tg, function() {
				// bot thread
				
			});
			t.start();
			
		}
	},
	play: function() {
		
	},
	
	newPlayer: function(name) {
		var p = new Player(name);
		p.id = "Player"+this.players.push(p);
		return p;
	}
});

