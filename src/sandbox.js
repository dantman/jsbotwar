
function Sandbox() {
	var {Context, NativeGlobal} = org.mozilla.javascript;
	this.context = Context.getCurrentContext();
	this.global = this.context.initStandardObjects();
	this.init();
}
Object.merge(Sandbox.prototype, {
	init: function() {
		this.exec('src/sandbox-clean.js');
		this.exec('lib/wrench17.js');
	},
	eval: function(source) {
		return this.context.evaluateString(this.global, source, "<eval:"+source.substr(0,32)+">", 1, null);
	},
	exec: function(fname) {
		var {File, FileInputStream, InputStreamReader, BufferedReader} = java.io;
		var f = new File(fname);
		var r = new BufferedReader(new InputStreamReader(new FileInputStream(f), "UTF-8"));
		return this.context.evaluateReader(this.global, r, fname, 1, null);
	}
});


