
function Window() {
	var {JFrame, WindowConstants} = javax.swing;
	
	var jframe = this.jframe = new JFrame("jsBotWar");
	jframe.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
	var canvas = this.canvas = new JCanvas([500, 500]);
	
	jframe.add(canvas.jComponent);
	jframe.pack();
	jframe.show();
}

