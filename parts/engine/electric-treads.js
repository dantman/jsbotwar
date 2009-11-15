var ElectricMotor = Part.prepare("engine");
ElectricMotor.cost = 1200.00;
ElectricMotor.weight = 50;
ElectricMotor.init = function() {
	if ( !this.conf.power || !this.bot.parts[this.conf.power] || this.bot.parts[this.conf.power]['class'] !== "battery" )
		throw new BotConfigError("Engine does not have a power source.");
	if ( !this.conf.treads || !this.bot.parts[this.conf.treads] || this.bot.parts[this.conf.treads]['class'] !== "treads" )
		throw new BotConfigError("Treads are not connected to the engine.");
	this.power = this.bot.parts[this.conf.power];
	this.treads = this.bot.parts[this.conf.treads];
	this._leftRPM = 0;
	this._rightRPM = 0;
};
ElectricMotor.maxRPM = 500;
ElectricMotor.sandboxInit = function(sbPart) {
	// @todo, Make these cross-scope safe
	var part = this;
	sbPart.setLeftRPM = function(rpm) {
		part._leftRPM = Number(rpm).confineTo(-ElectricMotor.maxRPM, ElectricMotor.maxRPM);
	};
	sbPart.setRightRPM = function(rpm) {
		part._rightRPM = Number(rpm).confineTo(-ElectricMotor.maxRPM, ElectricMotor.maxRPM);
	};
};
ElectricMotor.prototype.runLogicSegment = function(ms) {
	// @todo Power consumption
	
	var leftRotations = (this._leftRPM/60000)*ms;
	var rightRotations = (this._rightRPM/60000)*ms;
	this.treads.leftRotate(leftRotations*360);
	this.treads.rightRotate(rightRotations*360);
};
return ElectricMotor;
