
import { Camera } from '../camera/Camera';
import { ControlNode } from '../controlNode/controlNode';
import { Frustum } from '../core/Frustum/Frustum';
import { BufferGeometry } from '../core/Geometry';
import { Node } from '../core/Node/Node';
import { Matrix3 } from '../math/Matrix3';
import { Scene } from '../scene/Scene';
import { ClassType } from '../utils/models';
import { SHADER_TYPE } from './const';
import { WebGLProgram } from './webgl/WebGLProgram';
import { PrimitiveShapeProgram } from './webgl/programs/primitiveShape/PrimitiveShapeProgram';
import { PrimitiveShapeOutlineProgram } from './webgl/programs/primitiveShapeOutline/primitiveShapeOutline';



export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;

	projectionMatrix = new  Matrix3();
	projectionMatrixArray: number[] = [];

	viewMatrix = new Matrix3()
	viewMatrixArray: number[] = [];

	frustum: Frustum;
	renderList: [] = [];
	postEffects: Node[] = [];
	webGLProgramMap = new Map<string, WebGLProgram>()
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
		this.registerProgram(SHADER_TYPE.PRIMITIVE, PrimitiveShapeProgram)
		this.registerProgram(SHADER_TYPE.PRIMITIVE_OUTLINE, PrimitiveShapeOutlineProgram)

	}

	registerProgram(name: string, Program: ClassType<WebGLProgram>) {
		this.webGLProgramMap.set(name, new Program(this.gl))
	}

	render(scene: Scene, camera: Camera, controlNode: ControlNode) {
		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.viewMatrix.copy(camera.computedMatrix())

		this.frustum.updateRenderList(scene, controlNode, camera)

		this.projectionMatrixArray = this.projectionMatrix.toArray()
		this.viewMatrixArray = this.viewMatrix.toArray()
		
		this.objectsRender(this.frustum.nodesInViewport, camera)
		this.objectsRender(this.postEffects, camera)

		this.controlNodeRender(controlNode, camera)
	}

	controlNodeRender(controlNode: ControlNode, camera: Camera) {
		if (!controlNode.isVisible) { return }
		this.targetRender(controlNode, camera)
		this.objectsRender(controlNode.children, camera)
	}

	objectsRender(nodeList: Node<BufferGeometry>[], camera: Camera) {
		nodeList.forEach(node => {
			if (node.isVisible) {
				this.targetRender(node, camera)
			}
		})
	}

	targetRender(node: Node, camera: Camera) {
		if (this.webGLProgramMap.has(node.shaderType)) {
			node.beforeRender(camera)
			const program = this.webGLProgramMap.get(node.shaderType)
			program.applyInstruction(node, {
				u_matrixP: this.projectionMatrixArray,
				u_matrixV: this.viewMatrixArray,
				u_zoom: camera.zoom,
			}, camera)
		} else {
			console.warn(`Отсутствует програма для отрисовки узла ${node.guid}`)
		}
	}
}
