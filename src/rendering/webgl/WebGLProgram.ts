import { Camera } from "../../camera/Camera";
import { Node } from "../../core/Node/Node";
import { WebGLShader } from "./WebGLShader";
import { AttributeSetter } from "./setters/AttributeSetter";
import { UniformSetter } from "./setters/UniformSetter";

export class WebGLProgram {
    gl: WebGL2RenderingContext
    program: WebGLProgram;
    vertexShader: WebGLShader;
	fragmentShader: WebGLShader;
    uniformSetter: UniformSetter;
	attributeSetter: AttributeSetter;

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

        this.uniformSetter = new UniformSetter(gl, this.program);
		this.attributeSetter  = new AttributeSetter(gl, this.program);
    }

    applyInstruction(node: Node, uniforms: { [key: string]: unknown }, camera: Camera) {}
}