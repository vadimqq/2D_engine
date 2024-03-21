import { Node } from "../../../../core/Node/Node";
import { createBufferInfoFromArrays } from "../../../../utils";
import { WebGLProgram } from "../../WebGLProgram";
import fs from "./shaders/fs";
import vs from "./shaders/vs";

export class PrimitiveShapeOutlineProgram extends WebGLProgram {
    constructor(gl: WebGL2RenderingContext) {
        super(gl, vs, fs)
    }

    applyInstruction(node: Node, uniforms: { [key: string]: unknown }) {
		this.gl.useProgram(this.program);
		const uniformsThatAreComputedForEachObject = {
            ...uniforms,
			u_matrix: node.computeWorldMatrix().toArray(),
			u_color: node.color.computedColor,
			u_size: [node.size.x, node.size.y],
		}
		const bufferInfo = createBufferInfoFromArrays(this.gl, node.geometry);

		this.attributeSetter.setBuffersAndAttributes(bufferInfo);
		this.uniformSetter.setUniforms(uniformsThatAreComputedForEachObject)

	    this.gl.drawElements(this.gl.TRIANGLES, bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
		this.extraInstruction(node, uniforms)
    }

	extraInstruction(node: Node, uniforms: { [key: string]: unknown }) {
		this.gl.useProgram(this.program);
		const uniformsThatAreComputedForEachObject = {
            ...uniforms,
			u_matrix: node.computeWorldMatrix().toArray(),
			u_color: [0, 0.392, 0.937, 1.0],
			u_size: [node.size.x, node.size.y],
		}
		const bufferInfo = createBufferInfoFromArrays(this.gl, node.geometry);

		this.attributeSetter.setBuffersAndAttributes(bufferInfo);
		this.uniformSetter.setUniforms(uniformsThatAreComputedForEachObject)

	    this.gl.drawElements(this.gl.LINE_STRIP, bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);

	}
}