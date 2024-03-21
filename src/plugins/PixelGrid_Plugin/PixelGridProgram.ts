import { Camera } from "../../camera/Camera";
import { Node } from "../../core/Node/Node";
import { WebGLProgram } from "../../rendering/webgl/WebGLProgram";
import { createBufferInfoFromArrays } from "../../utils";
import fs from "./shaders/fs";
import vs from "./shaders/vs";

export class PixelGridProgram extends WebGLProgram {
    constructor(gl: WebGL2RenderingContext) {
        super(gl, vs, fs)
    }

    applyInstruction(node: Node, uniforms: { [key: string]: unknown }, camera: Camera) {
		this.gl.useProgram(this.program);
		const uniformsThatAreComputedForEachObject = {
            ...uniforms,
            u_resolution: [camera.width, camera.height],
            u_cameraPosition: [camera.position.x, camera.position.y],
		}
		const bufferInfo = createBufferInfoFromArrays(this.gl, node.geometry);

		this.attributeSetter.setBuffersAndAttributes(bufferInfo);
		this.uniformSetter.setUniforms(uniformsThatAreComputedForEachObject)

	    this.gl.drawElements(this.gl.TRIANGLES, bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
    }
}