import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Color } from "../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../core/Node/Node";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { SHADER_TYPE } from "../rendering/const";
import { ResizeVertexControlManager } from "./ResizeControls/ResizeInstrumentManager";
import { ControlNodeGeometry } from "./controlNodeGeometry";


interface ControlNodeEvents {
	'_on_update': [node: ControlNode];
}
export class ControlNode extends Node<ControlNodeGeometry> {
	shaderType: string;
	position = new Vector2(0, 0);
	rotation = 0;
	scale = new Vector2(1, 1);
	isVisible = false;
	transformMatrix = new Matrix3()

	private calculateSizeService = new CalculateSizeService();
	private resizeVertexControlManager: ResizeVertexControlManager

	nodeMap = new Map<number,{
		node: Node<BufferGeometry>;
		prevMatrix: Matrix3;
	}>();

	constructor() {
		super({
			geometry: new ControlNodeGeometry(),
        	color: new Color({ r: 1, g: 1, b: 1, a: 0.5 }),
			systemType: NODE_SYSTEM_TYPE.CONTROL_NODE,
			shaderType: SHADER_TYPE.PRIMITIVE
		});
		this.setSize(100, 100)
		this.geometry.updateGeometry(this.size)
		this.resizeVertexControlManager = new ResizeVertexControlManager(this)
		this.resizeVertexControlManager.init()
	}

	setRotation(angle: number) {
		this.rotation = angle
		this.needUpdateMatrix = true
	}

	setPosition(vector: Vector2) {
		this.transformMatrix.setPosition(vector)
		const nodeList = Array.from(this.nodeMap.values())
		nodeList.forEach(({node, prevMatrix}) => {
			node.localMatrix.copy(prevMatrix)
			node.localMatrix.multiply(this.transformMatrix)
			node.needUpdateMatrix = true
		})
		this._calculateSizeAndPosition()
	}
	setScale(vector: Vector2) {
		this.scale = vector
		this.needUpdateMatrix = true
	}

	addNode(node: Node<BufferGeometry>) {
		this.nodeMap.set(node.guid, { node, prevMatrix: node.localMatrix.clone() })
		this._calculateSizeAndPosition()
		this.isVisible = true
	}

	removeNode(guid: number) {
		this.nodeMap.delete(guid)
		this._calculateSizeAndPosition()
		this.isVisible = true
	}

	hasNode(guid: number) {
		return this.nodeMap.has(guid)
	}

	clearNodeList() {
		this.nodeMap = new Map()
		this.isVisible = false
		this.size.set(0, 0)
	}

	startNodeMutation() {
		// this._updateNodePreviousMatrix()
	}

	endNodeMutation() {
		this._updateNodePreviousMatrix()
	}

	private _updateNodePreviousMatrix() {
		const nodeKeyList = Array.from(this.nodeMap.keys())
		nodeKeyList.forEach((guid) => {
			const { node, prevMatrix } = this.nodeMap.get(guid)
			prevMatrix.copy(node.localMatrix)
		})
	}

	private _calculateSizeAndPosition() {
		if (this.nodeMap.size > 1) {
			const { minX, maxX, minY, maxY } = this.calculateSizeService.calculateSizeMultiLayer(Array.from(this.nodeMap.values()))

			this.setSize(maxX - minX, maxY - minY)
			this.geometry.updateGeometry(this.size)

			this.localMatrix.identity()
			this.localMatrix.translate(minX, minY)
			this.needUpdateMatrix = true

		} else if (this.nodeMap.size == 1) {
			const {node} = Array.from(this.nodeMap.values())[0]

			this.setSize(node.size.x, node.size.y)
			this.geometry.updateGeometry(this.size)

			this.localMatrix.copy(node.localMatrix)
			this.needUpdateMatrix = true
		}
		this.emit('_on_update', this)
	}
}

class CalculateSizeService {
	leftTop = new Vector2();
	rightTop = new Vector2();
	rightBottom = new Vector2();
	leftBottom = new Vector2();

	calculateSizeMultiLayer(nodeList:{
		node: Node<BufferGeometry>;
		prevMatrix: Matrix3;
	}[]) {


		let minX = 0;
		let minY = 0;
		let maxX = 0;
		let maxY = 0;
	
		nodeList.forEach(({node}) => {
	
		  this.leftTop
			.set(0, 0)
			.applyMatrix3(node.localMatrix);
		  this.rightTop
			.set(node.size.x, 0)
			.applyMatrix3(node.localMatrix);
		  this.rightBottom
			.set(node.size.x, node.size.y)
			.applyMatrix3(node.localMatrix);
		  this.leftBottom
			.set(0, node.size.y)
			.applyMatrix3(node.localMatrix);
	
		  const min = this.leftTop
			.clone()
			.min(this.rightTop)
			.min(this.rightBottom)
			.min(this.leftBottom);
	
		  const max = this.leftTop
			.clone()
			.max(this.rightTop)
			.max(this.rightBottom)
			.max(this.leftBottom);
	
		  if (!minX || minX > min.x) {
			minX = min.x;
		  }
		  if (!maxX || maxX < max.x) {
			maxX = max.x;
		  }
		  if (!minY || minY > min.y) {
			minY = min.y;
		  }
		  if (!maxY || maxY < max.y) {
			maxY = max.y;
		  }
		});
	
		return { maxX, minX, minY, maxY };
	  }
}