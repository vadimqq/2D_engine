const VSHADER_SOURCE =
	'attribute vec2 a_Position;\n' +
	'attribute vec3 a_Color;\n' +
	'varying vec3 v_Color;\n' +
	'void main() {\n' +
	' v_Color = a_Color;\n' +
	' gl_Position = vec4(a_Position,0.0,1.0);\n' +
	' }\n';

const FSHADER_SOURCE =
	' precision mediump float;\n' +
	' varying vec3 v_Color;\n' +
	' void main() {\n' +
	' gl_FragColor = vec4(v_Color,1.0);\n' +
	' }\n';

class Object {
	constructor(gl, vertex) {
		this.gl = gl;
		this.vertex = vertex;
		// this.face = face;
		this.program = this.gl.createProgram();
		this.initShaders(this.gl, this.program);
		this.aPositionLoc = this.gl.getAttribLocation(this.program, 'a_Position');
		this.aColorLoc = this.gl.getAttribLocation(this.program, 'a_Color');
	}

	getShader(id, str) {
		let shader;
		if (id === 'vs') {
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);

		} else if (id === 'fs') {
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else {
			return null;
		}

		this.gl.shaderSource(shader, str);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			alert(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	initShaders() {
		const VS = this.getShader('vs', VSHADER_SOURCE);
		const FS = this.getShader('fs', FSHADER_SOURCE);

		this.gl.attachShader(this.program, VS);
		this.gl.attachShader(this.program, FS);
		this.gl.linkProgram(this.program);

		this.gl.useProgram(this.program);
	}

	render() {
		this.gl.useProgram(this.program);
		this.gl.enableVertexAttribArray(this.aPositionLoc);
		this.gl.enableVertexAttribArray(this.aColorLoc);

		this.TRIANGLE_VERTEX = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertex), this.gl.STATIC_DRAW);

		// this.TRIANGLE_FACES = this.gl.createBuffer();
		//
		// this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TRIANGLE_FACES);
		// this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint16Array(this.face), this.gl.STATIC_DRAW);

		this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.gl.vertexAttribPointer(this.aPositionLoc,2, this.gl.FLOAT,false,4 * (2 + 3), 0);
		this.gl.vertexAttribPointer(this.aColorLoc, 3, this.gl.FLOAT, false, 4 * (2 + 3), 2 * 4);

		// this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
		this.gl.drawArrays(this.gl.TRIANGLES,0, 3);
	}
}
