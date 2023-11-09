function loop(){
	window.game.update();
	requestAnimationFrame(loop);
}

const initChickenCoords = {
	X: 80,
	Y: 40,
};

const chickenParams = {
	speed: 0.001,
	radius: 50,
}

class Game{
	constructor(){
		this.canvasElm = document.createElement("canvas");
		this.canvasElm.width = 800;
		this.canvasElm.height = 600;
		
		this.worldSpaceMatrix = new M3x3();
		
		this.gl = this.canvasElm.getContext("webgl2");
		this.gl.clearColor(0.4,0.6,1.0,0.0);
		
		document.body.appendChild(this.canvasElm);
		
		let vs = document.getElementById("vs_01").innerHTML;
		let fs = document.getElementById("fs_01").innerHTML;
		
		this.sprite1 = new Sprite(this.gl, "img/manonfire.png", vs, fs, {width:48, height:48});
		this.sprite2 = new Sprite(this.gl, "img/walker.png", vs, fs, {width:64, height:64});
		
		this.sprite1Pos = new Point();
		this.sprite2Pos = new Point(initChickenCoords.X, initChickenCoords.Y);
		
		this.sprite1Frame = new Point();
		this.sprite2Frame = new Point(initChickenCoords.X, initChickenCoords.Y);
	}
	
	resize(x,y){
		this.canvasElm.width = x;
		this.canvasElm.height = y;
		
		let wRatio = x / (y/240);
		this.worldSpaceMatrix = new M3x3().transition(-1, 1).scale(2/wRatio,-2/240);
	}
	
	update(){
		this.gl.viewport(0,0, this.canvasElm.width, this.canvasElm.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		
		const randomX = this._getRandomCoord(0.006, 3);
		const randomY = this._getRandomCoord(0.002, 2);

		this.sprite1Frame.x = randomX;
		this.sprite1Frame.y = randomY;
		
		this.sprite2Frame.x = randomX;
		this.sprite2Frame.y = randomY;
		

		const randomGo = this._getRandomChickenGo(chickenParams.speed);
		this.sprite2Pos.x = initChickenCoords.X + Math.cos(randomGo) * chickenParams.radius;
		this.sprite2Pos.y = initChickenCoords.Y + Math.sin(randomGo) * chickenParams.radius;
		
		this.sprite1.render(this.sprite1Pos, this.sprite1Frame);
		this.sprite2.render(this.sprite2Pos, this.sprite2Frame);
		
		this.gl.flush();
	}

	_getRandomCoord(factor, delimetr){
		return (new Date() * factor) % delimetr;
	}

	_getRandomChickenGo(factor){
		return factor * Date.now();
	}
}