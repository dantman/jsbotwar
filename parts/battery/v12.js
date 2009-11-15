var V12Battery = Part.prepare("battery");
V12Battery.cost = 75.00;
V12Battery.weight = 7;
V12Battery.init = function() {
	this.charge = 750;
};
return V12Battery;
