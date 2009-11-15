
function Bot(o) {
	this.parts = {};
	this.conf = o.conf;
	
	for ( var k in this.conf )
		this.parts[k] = Part.create(this, this.conf[k]);
	
	this._earlyValidate();
	
	this.sand = new Sandbox();
	this.sand.eval('function Bot() { this.parts = {}; }; function Part() {}; global.bot = new Bot;');
	
	for each ( var part in this.parts )
		part.init();
	
	for ( var k in this.parts ) {
		var part = this.parts[k];
		var sbParts = this.sand.global.bot.parts;
		sbParts[k] = new this.sand.global.Part();
		sbParts[k]['class'] = this.sand.global.String(part['class']);
		sbParts[k].type = this.sand.global.String(part.type);
		part.sandboxInit(sbParts[k]);
	}
	
	if ( o.source )
		this.sand.compileFunction("function() {\n" + o.source + "\n//*/\n}", 1).call(this.sand.global.bot);
	
	this.sand.eval("if ( bot.onStartup ) bot.onStartup();");
	
	// Universe state
	this.x = 0;
	this.y = 0;
	this.theta = 0;
}
Object.defineProperties(Bot.prototype, {
	cost: {
		get: function() {
			var cost = 0;
			for each ( var part in this.parts )
				cost += part.cost;
			return cost;
		}
	},
	weight: {
		get: function() {
			var weight = 0;
			for each ( var part in this.parts )
				weight += part.weight;
			return weight;
		}
	}
});
Object.merge(Bot.prototype, {
	/**
	 * Validates early stuff like requirements that the bot have a single board and body.
	 */
	_earlyValidate: function() {
		var has = {};
		for each ( var T in Part.classes )
			has[T['class']] = 0;
		
		for each ( var part in this.parts )
			has[part['class']]++;
		
		if ( has.board < 1 )
			throw new BotConfigError("A bot cannot function without a board.");
		if ( has.board > 1 )
			throw new BotConfigError("A bot may not have more than one board.");
		if ( has.board < 1 )
			throw new BotConfigError("A bot cannot function without a board.");
		if ( has.board > 1 )
			throw new BotConfigError("A bot may not have more than one board.");
		
		return false;
	},
	runLogicSegment: function(ms) {
		for each ( var part in this.parts )
			part.resetLogic();
		for each ( var part in this.parts )
			part.runLogicSegment(ms);
		for each ( var part in this.parts )
			part.applyLogic();
	},
	radius: .80
});

