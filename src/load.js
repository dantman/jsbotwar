load('src/async.js');

this.global = this;
Object.defineProperty(Array.prototype, "top", { get: function() { return this[this.length-1]; } });
(function(parse) { JSON.parse = function() { arguments[0] = arguments[0].trim(); return parse.apply(this, arguments); } })(JSON.parse);
Number.prototype.confineTo = function(min, max) { return Math.max(Math.min(this, max), min) };
Number.prototype.toDeg = function toDeg() { return this / (Math.PI/180) };
Number.prototype.toRad = function toRad() { return this * (Math.PI/180) };
load('lib/wrench17.js');
load('src/FS.js');
load('src/image.js');
load('src/canvas.js');
load('src/window.js');
load('src/sandbox.js');
load('src/game.js');

