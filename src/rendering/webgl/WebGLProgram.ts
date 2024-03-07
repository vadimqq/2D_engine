import { WebGLShader } from "./WebGLShader";

export class WebGLProgram {
    gl: WebGL2RenderingContext
    program: WebGLProgram;
    vertexShader: WebGLShader;
	fragmentShader: WebGLShader;

    constructor(gl: WebGL2RenderingContext, vs: string, fs: string) {
        this.gl = gl;
        this.program = gl.createProgram() as WebGLProgram;

        this.vertexShader = WebGLShader(gl, gl.VERTEX_SHADER, vs)
	    this.fragmentShader = WebGLShader(gl, gl.FRAGMENT_SHADER, fs)

        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);

        gl.linkProgram(this.program);

        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            console.error("Cannot load shader \n"+gl.getProgramInfoLog(this.program));
        }

        gl.deleteShader(this.vertexShader);
        gl.deleteShader(this.fragmentShader);
    }
}