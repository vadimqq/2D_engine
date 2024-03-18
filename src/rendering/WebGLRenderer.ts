
import { Camera } from '../camera/Camera';
import { ControlNode } from '../controlNode/controlNode';
import { BufferGeometry } from '../core/BufferGeometry/BufferGeometry';
import { Frustum } from '../core/Frustum/Frustum';
import { Node } from '../core/Node/Node';
import { Matrix3 } from '../math/Matrix3';
import { Scene } from '../scene/Scene';
import { createBufferInfoFromArrays } from '../utils';
import { SHADER_TYPE } from './const';
import { WebGLProgram } from './webgl/WebGLProgram';
import { AttributeSetter } from './webgl/setters/AttributeSetter';
import { UniformSetter } from './webgl/setters/UniformSetter';
import control_node_fs from './webgl/shaders/ControlNodeShader/fs';
import control_node_vs from './webgl/shaders/ControlNodeShader/vs';
import fs from './webgl/shaders/primitiveShader/fs';
import vs from './webgl/shaders/primitiveShader/vs';



export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	projectionMatrix = new  Matrix3();
	viewMatrix = new Matrix3()
	frustum: Frustum;
	renderList: [] = [];
	postEffects: Node[] = [];
	webGLProgramMap = new Map<string, {
		program: WebGLProgram;
		uniformSetter: UniformSetter;
		attributeSetter: AttributeSetter;
	}>()
	constructor(canvas: HTMLCanvasElement){
		this.canvasElement = canvas	
        this.gl = this.canvasElement.getContext("webgl2", { antialias: true }) as WebGL2RenderingContext;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.projectionMatrix.set(
			2 / this.canvasElement.width, 0, 0,
			0, -2 / this.canvasElement.height, 0,	
			-1, 1, 1
		)
		this.frustum = new Frustum(this.projectionMatrix)
		this.registerProgram(SHADER_TYPE.PRIMITIVE, vs, fs)
		this.registerProgram(SHADER_TYPE.CONTROL_NODE_SHADER, control_node_vs, control_node_fs)


	}

	registerProgram(name: string, vertexShader: string, fragmentShader: string) {
		const program = new WebGLProgram(this.gl, vertexShader, fragmentShader)
		const uniformSetter = new UniformSetter(this.gl, program.program);
		const attributeSetter  = new AttributeSetter(this.gl, program.program);
		this.webGLProgramMap.set(name, {
			program,
			uniformSetter,
			attributeSetter
		})
	}

	render(scene: Scene, camera: Camera, controlNode: ControlNode) {
		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.viewMatrix.copy(camera.computedMatrix())

		this.frustum.updateRenderList(scene, controlNode, camera)
		
		this.objectsRender(this.frustum.nodesInViewport, camera)
		this.postRender(camera)
		this.controlNodeRender(controlNode, camera)
	}
	postRender(camera: Camera) {
		const projectionMatrix = this.projectionMatrix.toArray()
		const viewMatrix = this.viewMatrix.toArray()
		this.postEffects.forEach((effect) => {
			if (effect.isVisible) {
				if (this.webGLProgramMap.has(effect.shaderType)) {
					const programInfo = this.webGLProgramMap.get(effect.shaderType)
					this.gl.useProgram(programInfo.program.program);
					const uniformsThatAreComputedForEachObject = {
						u_resolution: [this.canvasElement.width, this.canvasElement.height],
						u_zoom: camera.zoom,
						u_cameraPosition: [camera.position.x, camera.position.y],
						u_matrixP: projectionMatrix,//TODO слишком часто сетаем матрицу
						u_matrixV: viewMatrix,//TODO слишком часто сетаем матрицу
					}
					const bufferInfo = createBufferInfoFromArrays(this.gl, effect.geometry);
					programInfo.attributeSetter.setBuffersAndAttributes(bufferInfo);
					
					programInfo.uniformSetter.setUniforms(uniformsThatAreComputedForEachObject)
					this.gl.drawElements(this.gl.TRIANGLES, bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
				} else {
					console.warn(`Отсутствует програма для отрисовки узла ${effect.guid}`)
				}
			}
		})
	}
	controlNodeRender(controlNode: ControlNode, camera: Camera) {
		if (!controlNode.isVisible) { return }
		this.objectsRender([controlNode], camera)
		this.objectsRender(controlNode.children, camera)
	}
	objectsRender(objects: Node<BufferGeometry>[], camera: Camera) {
		const projectionMatrix = this.projectionMatrix.toArray()
		const viewMatrix = this.viewMatrix.toArray()
		objects.forEach(object => {
			if (this.webGLProgramMap.has(object.shaderType)) {
				object.beforeRender(camera)
				const programInfo = this.webGLProgramMap.get(object.shaderType)
				this.gl.useProgram(programInfo.program.program);
				const uniformsThatAreComputedForEachObject = {
					u_matrix: object.computeWorldMatrix().toArray(),
					u_color: object.color.computedColor,
					u_matrixP: projectionMatrix,//TODO слишком часто сетаем матрицу
					u_matrixV: viewMatrix,//TODO слишком часто сетаем матрицу
					u_zoom: camera.zoom,
					u_size: [object.size.x, object.size.y],
				}
				const bufferInfo = createBufferInfoFromArrays(this.gl, object.geometry);
				programInfo.attributeSetter.setBuffersAndAttributes(bufferInfo);
				
				programInfo.uniformSetter.setUniforms(uniformsThatAreComputedForEachObject)

				this.gl.drawElements(this.gl.TRIANGLES, bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
			} else {
				console.warn(`Отсутствует програма для отрисовки узла ${object.guid}`)
			}
			
		})
	}
}
