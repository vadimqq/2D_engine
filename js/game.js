const triangle_vertex = [
	-0.8, -0.5,
	1.0, 0.0, 0.0,
	0.0, 0.8,
	0.0, 1.0, 0.0,
	0.8, -0.5,
	0.0, 0.0, 1.0
];
// const triangle_face = [0, 1, 2, 0, 2, 3];

function loop(){
	window.game.update();
	requestAnimationFrame(loop);
}

class Game{
	constructor() {
		this.canvasElm = document.createElement("canvas");
		this.canvasElm.width = 800;
		this.canvasElm.height = 600;
		
		this.gl = this.canvasElm.getContext("webgl2");
		this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
		
		document.body.appendChild(this.canvasElm);

		this.triangle = new Object(this.gl, triangle_vertex);
	}
	
	resize(x, y){
		this.canvasElm.width = x;
		this.canvasElm.height = y;
	}

	update(){
		this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.triangle.render();
		
		this.gl.flush();
	}
}