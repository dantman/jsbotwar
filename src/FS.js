
var {File, FileInputStream, InputStreamReader, BufferedReader} = java.io;
var FS = {
	exists: function(fname) {
		return !!(new File(fname)).exists();
	},
	read: function(fname) {
		var f = new File(fname);
		var r = new BufferedReader(new InputStreamReader(new FileInputStream(f), "UTF-8"));
		
		function buffer(len, source) {
			var cbuf = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE, len);
			if ( source )
				java.lang.System.arraycopy(source, 0, cbuf, 0, Math.min(source.length, cbuf.length));
			return cbuf;
		}
		
		var length = 0, cbuf = buffer(512);
		for(;;) {
			if ( length > cbuf.length-32 )
				cbuf = buffer(length+512, cbuf);
			var rlen = r.read(cbuf, length, cbuf.length-length);
			if ( rlen == -1 )
				break;
			length += rlen;
		}
		
		return String(new java.lang.String(cbuf, 0, length));
	}
};
JSON.load = function load(fname) {
	return JSON.parse(FS.read(fname));
};

