{
	let {BufferedImage} = java.awt.image;
	function Image(src) {
		this.src = src;
		this.jImage = javax.imageio.ImageIO.read(new java.io.File(this.src));
		this.width = this.jImage.getWidth();
		this.height = this.jImage.getHeight();
	};
}
