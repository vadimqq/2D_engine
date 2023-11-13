function loop(timeStamp = 0){
	window.game.update(timeStamp);
	requestAnimationFrame(loop);
}

let D_for_sprite = 0
const radius_for_sprite = 30
const speed_for_sprite = 0.0005

let center_point = null
let date = 0



const rectangle_vertex = [
    -0.5, -0.5,
    0.9, 0.1, 0.1,
    -0.5, 0.5,
    0.9, 0.1, 0.1,
    0.5, 0.5,
    0.1, 0.9, 0.0,
    0.5, -0.5,
    0.0, 0.0, 0.9,
]

const rectangle_face = [0, 1, 2, 0, 2, 3];

class Game{
	constructor(){
		this.canvasElm = document.createElement("canvas");
		this.canvasElm.width = 800;
		this.canvasElm.height = 600;
		this.lastTime = 0;
		this.requiredElapsed = 1000 / 10;
		this.worldSpaceMatrix = new M3x3();
		
		this.gl = this.canvasElm.getContext("webgl2");
		this.gl.clearColor(0.4,0.6,1.0,0.0);
		
		document.body.appendChild(this.canvasElm);
		
		let vs = document.getElementById("vs_01").innerHTML;
		let fs = document.getElementById("fs_01").innerHTML;
		
		this.sprite1 = new Sprite(this.gl, "img/manonfire.png", vs, fs, {width:48, height:48});
		this.sprite2 = new Sprite(this.gl, "img/walker.png", vs, fs, {width:64, height:64});
		
		center_point = new Point(0, 0)

		this.rectangle = new Object2D(this.gl, rectangle_vertex, rectangle_face);

		this.sprite1Pos = new Point();
		this.sprite2Pos = new Point();
		
		this.sprite1Frame = new Point();
		this.sprite2Frame = new Point();

	}
	
	resize(x,y){
		this.canvasElm.width = x;
		this.canvasElm.height = y;
		
		let wRatio = x / (y/240);
		this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2/wRatio,-2/240);
	}
	getDelta(timeStamp) {
		const elapsed = timeStamp - this.lastTime;
		if (elapsed > this.requiredElapsed) {
			this.lastTime = timeStamp;
		}
		return elapsed
	}
	update(timeStamp){
		const delta = this.getDelta(timeStamp)
		D_for_sprite -= delta
		date += delta * 0.001
		this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		
		this.sprite1Frame.x = (date) % 3;
		this.sprite1Frame.y = (date) % 2;
		
		this.sprite2Frame.x = (date) % 3;
		this.sprite2Frame.y = (date) % 2;

		this.sprite2Pos.x = Math.sin(D_for_sprite * speed_for_sprite) * radius_for_sprite + center_point.x
		this.sprite2Pos.y = Math.cos(D_for_sprite * speed_for_sprite) * radius_for_sprite + center_point.y

		
		this.sprite2.render(this.sprite2Pos, this.sprite2Frame);
		this.sprite1.render(this.sprite1Pos, this.sprite1Frame);
		this.sprite2.render(this.sprite2Pos, this.sprite2Frame);

		this.rectangle.render();
		
		this.gl.flush();
	}
}