(function(s, awt) {
	var {Color, Dimension} = awt;
	var {JComponent} = s;
	var {VolatileImage} = awt.image;
	
	function JCanvas(o) {
		o = o || {};
		var c = this;
		this.jComponent = new JavaAdapter(JComponent, {
			paintComponent: function(g) {
				var j = this;
				function validate() {
					return !c.jImage || j.getWidth() != c.jImage.getWidth() || j.getHeight() != c.jImage.getHeight() || c.jImage.contentsLost() ?
						VolatileImage.IMAGE_INCOMPATIBLE :
						c.jImage.validate(this.getGraphicsConfiguration());
				}
				do {
					switch(validate()) {
					case VolatileImage.IMAGE_INCOMPATIBLE:
						c.jImage = this.createVolatileImage(this.getWidth(), this.getHeight());
					case VolatileImage.IMAGE_RESTORED:
						var g2 = c.jImage.createGraphics();
						g2.setColor(Color.WHITE);
						g2.fillRect(0, 0, c.jImage.getWidth(), c.jImage.getHeight());
						c.render();
					}
					if ( c.jImage.contentsLost() )
						continue;
				
					g.setColor(Color.WHITE);
					g.fillRect(0, 0, this.getWidth(), this.getHeight());
					g.drawImage(c.jImage, 0, 0, null);
				} while( c.jImage.contentsLost() );
			}
		});
		this.jComponent.setPreferredSize(new Dimension(o.width||o[0]||0, o.height||o[1]||0));
	}
	Object.defineProperties(JCanvas.prototype, {
		width: {
			get: function() { return Number(this.jComponent.getWidth()); },
			set: function(val) { this.jComponent.setSize(val, this.jComponent.getHeight()); },
			configurable: false
		},
		height: {
			get: function() { return Number(this.jComponent.getHeight()); },
			set: function(val) { this.jComponent.setSize(this.jComponent.getWidth(), val); },
			configurable: false
		}
	});
	Object.merge(JCanvas.prototype, {
		render: function() {}
	});
	
	global.JCanvas = JCanvas;
})(javax.swing, java.awt);
