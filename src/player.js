
function Player() {
	this.bots = [];
	this.bottypes = [];
	this.credit = 0;
	this.factory = false;
}
Object.merge(Player.prototype, {
	addBotType: function addBotType(dirname) {
		this.bottypes.push({
			conf: JSON.load(dirname+'/bot.json'),
			source: FS.exists(dirname+'/bot.js') ? FS.read(dirname+'/bot.js') : false
		});
	},
	addBot: function addBot(bot) {
		this.bots.push(bot);
	}
});

