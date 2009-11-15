
function Factory(player) {
	this.player = player;
	this.cashInterval = setInterval(function() {
		this.player.credit += 50; // find a better calculation later
	}.bind(this), 10000);
}

