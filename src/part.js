
function Part(bot, doc) { return Part.create(bot, doc); }
Object.defineProperties(Part.prototype, {
	cost: {
		get: function() { return "_cost" in this ? this._cost : this.common.cost; },
		set: function(val) { this._cost = val; }
	},
	weight: {
		get: function() { return "_weight" in this ? this._weight : this.common.weight; },
		set: function(val) { this._weight = val; }
	}
});
Object.merge(Part.prototype, {
	runLogicSegment: function() { /* no op */ },
	resetLogic: function() { /* no op */ },
	applyLogic: function() { /* no op */ }
});
Part.fetch = function(C, t) {
	if ( !C._fetch ) C._fetch = {};
	if ( t in C._fetch ) return C._fetch[t];
	
	var fname = 'parts/'+C['class']+'/'+t+'.js';
	if ( !FS.exists(fname) )
		throw new BotConfigError("The "+t+" "+C['class']+" type does not exist.");
	
	var source = 
		"function() {\n" +
		FS.read(fname) +
		"\n//*/\n}";
	
	var cx = org.mozilla.javascript.Context.getCurrentContext();
	var fn = cx.compileFunction(global, source, fname, 2, null);
	
	var T = fn();
	T.prototype.type = T.type = t;
	T.C = C;
	
	return C._fetch[t] = T;
};
Part.classes = {};
Part.classPrepare = function(c) {
	function C() {};
	C.prototype = Object.create(Part.prototype);
	C.prototype['class'] = C['class'] = c;
	C.fetch = function(t) { return Part.fetch(C, t); }
	C.init = function() { /* no-op */ };
	C.sandboxInit = function() { /* no-op */ };
	Part.classes[c] = C;
	return C;
};
Part.prepare = function(c) {
	function T(bot, conf) {
		this.common = this.constructor;
		this.bot = bot;
		this.conf = conf;
	}
	T.prototype = Object.create(Part.classes[c].prototype);
	T.prototype.init = function() {
		T.init.call(this);
		T.C.init.call(this);
	};
	T.prototype.sandboxInit = function(sbPart) {
		T.sandboxInit.call(this, sbPart);
		T.C.sandboxInit.call(this, sbPart);
	};
	//T.prototype.type = T.type = ???;
	T.init = function() { /* no-op */ };
	T.sandboxInit = function() { /* no-op */ };
	return T;
};
Part.create = function(bot, doc) {
	if ( !bot )
		throw new Error("Cannot create a part without a bot.");
	if ( !doc['class'] )
		throw new BotConfigError("Part class unspecified: "+JSON.stringify(doc));
	if (!(doc['class'] in Part.classes))
		throw new BotConfigError("Part class "+doc['class']+" does not exist: "+JSON.stringify(doc));
	if ( !doc.type )
		throw new BotConfigError("Part type of "+doc['class']+" unspecified: "+JSON.stringify(doc));
	var T = Part.classes[doc['class']].fetch(doc.type);
	var p = new T(bot, doc);
	return p;
};

(function() {
	
	var Board   = Part.classPrepare("board");
	var Body    = Part.classPrepare("body");
	var Battery = Part.classPrepare("battery");
	var Engine  = Part.classPrepare("engine");
	var Treads  = Part.classPrepare("treads");
	Treads.prototype.leftRotate = function(deg) {
		this._leftDegrees = deg;
	};
	Treads.prototype.rightRotate = function(deg) {
		this._rightDegrees = deg;
	};
	Treads.prototype.resetLogic = function() {
		this._leftDegrees = 0;
		this._rightDegrees = 0;
	};
	Treads.prototype.applyLogic = function() {
		var circumference = this.radius*2 * Math.PI;
		var l = this._leftDegrees/360 * circumference;
		var r = this._rightDegrees/360 * circumference;
		
		var move = (l+r)/2;
		var rot = (l-r)/2;
		
		// Do x/y
		this.bot.x += Math.cos(this.bot.theta.toDeg()) * move;
		this.bot.y += Math.sin(this.bot.theta.toDeg()) * move;
		
		// Then do angle
		var botCirc = this.bot.radius*2 * Math.PI;
		var deg = (rot/botCirc) * 360;
		this.bot.theta += deg;
		
	};
})();

