import { Material } from "../materials/Material";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";

export class Sprite {
	constructor(gl, img_url, vs, fs, opts={}){
		this.gl = gl;
		this.isLoaded = false;
		this.material = new Material(gl,vs,fs);
		
		this.size = new Vector2(64,64);
		if("width" in opts){
			this.size.x = opts.width * 1;
		}
		if("height" in opts){
			this.size.y = opts.height * 1;
		}
		
		this.image = new Image();
		this.image.src = img_url;
		this.image.sprite = this;
		this.image.onload = function(){
			this.sprite.setup();
		}
		
		
	}
	static createRectArray(x=0, y=0, w=1, h=1){
		return new Float32Array([
			x, y,
			x+w, y,
			x, y+h,
			x, y+h,
			x+w, y,
			x+w, y+h
		]);
	}
	setup(){
		let gl = this.gl;
		
		gl.useProgram(this.material.program);
		this.gl_tex = gl.createTexture();
		
		gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		this.uv_x = this.size.x / this.image.width;
		this.uv_y = this.size.y / this.image.height;
		
		this.tex_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0,0,this.uv_x, this.uv_y), gl.STATIC_DRAW);
		
		
		this.geo_buff = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
		gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0,0,this.size.x, this.size.y), gl.STATIC_DRAW);
		
		this.aPositionLoc = gl.getAttribLocation(this.material.program, "a_position");
		this.aTexcoordLoc = gl.getAttribLocation(this.material.program, "a_texCoord");
		this.uImageLoc = gl.getUniformLocation(this.material.program, "u_image");
		
		this.uFrameLoc = gl.getUniformLocation(this.material.program, "u_frame");
		this.uWorldLoc = gl.getUniformLocation(this.material.program, "u_world");
		this.uObjectLoc = gl.getUniformLocation(this.material.program, "u_object");
		
		gl.useProgram(null);
		this.isLoaded = true;
		
	}
	render(position, frames){
		if(this.isLoaded){
			let gl = this.gl;
			
			let frame_x = Math.floor(frames.x) * this.uv_x;
			let frame_y = Math.floor(frames.y) * this.uv_y;
			
			let oMat = new Matrix3().transition(position.x, position.y);
			
			gl.useProgram(this.material.program);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.gl_tex);
			gl.uniform1i(this.uImageLoc, 0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.tex_buff);
			gl.enableVertexAttribArray(this.aTexcoordLoc);
			gl.vertexAttribPointer(this.aTexcoordLoc,2,gl.FLOAT,false,0,0);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.geo_buff);
			gl.enableVertexAttribArray(this.aPositionLoc);
			gl.vertexAttribPointer(this.aPositionLoc,2,gl.FLOAT,false,0,0);
			
			gl.uniform2f(this.uFrameLoc, frame_x, frame_y);
			// gl.uniformMatrix3fv(this.uWorldLoc, false, new Matrix3().getFloatArray());
			gl.uniformMatrix3fv(this.uObjectLoc, false, oMat.getFloatArray());
			
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
			
			gl.useProgram(null);
		}
	}
}