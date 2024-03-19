import { AttributeSetter } from "./webgl/setters/AttributeSetter";
import { UniformSetter } from "./webgl/setters/UniformSetter";

export interface IProgram {
	program: WebGLProgram;
	uniformSetter: UniformSetter;
	attributeSetter: AttributeSetter;
    instruction: (gl: WebGL2RenderingContext) => void;
}