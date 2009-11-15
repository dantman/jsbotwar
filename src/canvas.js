(function(s, awt) {
	var {Color, Dimension} = awt;
	var {JComponent} = s;
	var {VolatileImage, AffineTransformOp} = awt.image;
	var {AffineTransform, Rectangle2D} = awt.geom;
	
	function JCanvas(o) {
		o = o || {};
		var c = this;
		this.jComponent = new JavaAdapter(JComponent, {
			paintComponent: function(g) {
				var j = this;
				function validate() {
					return !c.jImage || j.getWidth() != c.jImage.getWidth() || j.getHeight() != c.jImage.getHeight() || c.jImage.contentsLost() ?
						VolatileImage.IMAGE_INCOMPATIBLE :
						c.jImage.validate(j.getGraphicsConfiguration());
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
		render: function render() {},
		refresh: function refresh() {
			this.jComponent.repaint(this.jComponent.getVisibleRect());
		},
		getContext: function getContext(contextId) {
			switch(contextId) {
			case '2d':
				return new CanvasRenderingContext2D(this);
			}
			return null;
		}
	});
	
	var colors = {};
	for each ( var c in "BLACK,BLUE,CYAN,DARK_GRAY,GRAY,GREEN,LIGHT_GRAY,MAGENTA,ORANGE,PINK,RED,WHITE,YELLOW".split(',') )
		colors[c.replace('_', '').toLowerCase()] = Color[c];
	
	function _jStyle(style) {
		if ( isString(style) ) {
			style = style.toLowerCase();
			if ( style in colors )
				return colors[style];
		}
		throw new Error("Unsupported color");
	}
	
	function CanvasRenderingContext2D(canvas) {
		Object.defineProperty(this, "canvas", { value: canvas, writable: false, configurable: false });
		this._g2d = this.canvas.jImage.createGraphics();
		this._stack = [];
		this.globalAlpha = 1.0;
		this.globalCompositeOperation = "source-over";
		this.strokeStyle = "black";
		this.fillStyle = "black";
		this.lineWidth = 1;
		this.lineCap = "butt"; // "butt", "round", "square"
		this.lineJoin = "miter"; // "round", "bevel", "miter"
		this.miterLimit = 10;
		this.shadowOffsetX = 0;
		this.shadowOffsetY = 0;
		this.shadowBlur = 0;
		this.shadowColor = "transparent black";
		this.font = "10px sans-serif";
		this.textAlign = "start"; // "start", "end", "left", "right", "center"
		this.textBaseline = "alphabetic"; // "top", "hanging", "middle", "alphabetic", "ideographic", "bottom"
	};
	Object.merge(CanvasRenderingContext2D.prototype, {
		_fillFix: function() {
			this._g2d.setPaint(_jStyle(this.fillStyle));
		},
		_strokeFix: function() {
			this._g2d.setPaint(_jStyle(this.strokeStyle));
		},
		save: function save() {
			
		},
		restore: function restore() {
			
		},
		scale: function scale(x, y) {
		},
		rotate: function rotate(angle) {
		},
		translate: function translate(x, y) {
		},
		transform: function transform(m11, m12, m21, m22, dx, dy) {
		},
		setTransform: function setTransform(m11, m12, m21, m22, dx, dy) {
		},
		createLinearGradient: function createLinearGradient(x0, y0, x1, y1) {
			//new CanvasGradient;
		},
		createRadialGradient: function createRadialGradient(x0, y0, r0, x1, y1, r1) {
		},
		createPattern: function createPattern(image, repetition) {
		},
		clearRect: function clearRect(x, y, w, h) {
		},
		fillRect: function fillRect(x, y, w, h) {
			this._fillFix();
			this._g2d.fill(new Rectangle2D.Double(x, y, w, h));
		},
		strokeRect: function strokeRect(x, y, w, h) {
			this._strokeFix();
		},
		beginPath: function beginPath() {
		},
		closePath: function closePath() {
		},
		moveTo: function moveTo(x, y) {
		},
		lineTo: function lineTo(x, y) {
		},
		quadraticCurveTo: function quadraticCurveTo(cpx, cpy, x, y) {
		},
		bezierCurveTo: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		},
		arcTo: function arcTo(x1, y1, x2, y2, radius) {
		},
		rect: function rect(x, y, w, h) {
		},
		arc: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
		},
		fill: function fill() {
		},
		stroke: function stroke() {
		},
		clip: function clip() {
		},
		isPointInPath: function isPointInPath(x, y) {
		},
		fillText: function fillText(text, x, y, maxWidth) {
		},
		strokeText: function strokeText(text, x, y, maxWidth) { // maxWidth is optional
		},
		measureText: function measureText(text) {
			// new TextMetrics
		},
		drawImage: function drawImage() {
			if ( arguments.length !== 1 && arguments.length !== 3 && arguments.length !== 5 && arguments.length !== 9 )
				throw new TypeError("Invalid number of arguments to drawImage");
			if ( arguments.length > 5 )
				var [image, sx, sy, sw, sh, dx, dy, dw, dh] = arguments;
			else
				var [image, dx, dy, dw, dh] = arguments;
			this._g2d.drawImage(image.jImage||image, new AffineTransformOp(new AffineTransform(), AffineTransformOp.TYPE_BICUBIC), dx||0, dy||0);
			// todo, handle the other arguments
		}
	});
	
	global.JCanvas = JCanvas;
})(javax.swing, java.awt);
