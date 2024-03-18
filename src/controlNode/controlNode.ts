import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Color } from "../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../core/Node/Node";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { SHADER_TYPE } from "../rendering/const";
import { RESIZE_CONTROL_TYPE } from "./ResizeControls/ResizeControl";
import { ResizeVertexControlManager } from "./ResizeControls/ResizeInstrumentManager";
import { ControlNodeGeometry } from "./controlNodeGeometry";


interface ControlNodeEvents {
	'update': [node: ControlNode];
	'change_visible': [node: ControlNode];
}
export class ControlNode extends Node<ControlNodeGeometry> {
	shaderType: string;
	isVisible = false;
	transformMatrix = new Matrix3()
	inverseWorldMatrix = new Matrix3()
	private calculateSizeService = new CalculateSizeService();
	private resizeVertexControlManager: ResizeVertexControlManager

	nodeMap = new Map<number,{
		node: Node<BufferGeometry>;
		prevMatrix: Matrix3;
		prevSize: Vector2;
	}>();

	constructor() {
		super({
			geometry: new ControlNodeGeometry(),
        	color: new Color({ r: 1, g: 1, b: 1, a: 0 }),
			systemType: NODE_SYSTEM_TYPE.CONTROL_NODE,
			shaderType: SHADER_TYPE.CONTROL_NODE_SHADER,
		});
		this.setSize(100, 100)
		this.geometry.updateGeometry(this.size)
		this.resizeVertexControlManager = new ResizeVertexControlManager(this)
		this.resizeVertexControlManager.init()
	}

	setRotation(angle: number) {
		this.needUpdateMatrix = true
	}

	setPosition(vector: Vector2) {
		if (this.nodeMap.size > 1) {
			this.nodeMap.forEach(({node, prevMatrix}) => {
				node.localMatrix
				.identity()
				.translate(vector.x , vector.y)
				.multiply(prevMatrix);
				node.needUpdateMatrix = true;
			});
		} else {
			const {node, prevMatrix} = this.nodeMap.values().next().value;
			node.localMatrix.copy(prevMatrix).translate(vector.x , vector.y);
			node.needUpdateMatrix = true;
		}
		this._calculateSizeAndPosition()
	}
	setScale(vector: Vector2, offset: RESIZE_CONTROL_TYPE = RESIZE_CONTROL_TYPE.LEFT_TOP) {
		const positionAdj = new Vector2();

		switch (offset) {
			case RESIZE_CONTROL_TYPE.LEFT_TOP:
				positionAdj.set(-vector.x, -vector.y)
				break;
			case RESIZE_CONTROL_TYPE.RIGHT_TOP:
				positionAdj.set(0, -vector.y)
			break;
			case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
				positionAdj.set(-vector.x, 0)
			break;
			default:
				break;
		}

		if (this.nodeMap.size > 1) {
			// this.nodeMap.forEach(({node, prevSize, prevMatrix}) => {
			// 	const test = new Vector2(prevSize.x + vector.x / prevSize.x, prevSize.y + vector.y / prevSize.y);
			// 	node.localMatrix.copy(prevMatrix).scale(test.x , test.y);
			// 	this.setPosition(positionAdj)
			// });
		} else {
			const {node, prevSize} = this.nodeMap.values().next().value;
			node.setSize(prevSize.x + vector.x, prevSize.y + vector.y)
			this.setPosition(positionAdj)
		}
		this._calculateSizeAndPosition()
	}

	addNode(node: Node<BufferGeometry>) {
		this.nodeMap.set(node.guid, {
			node,
			prevMatrix: node.localMatrix.clone(),
			prevSize: node.size.clone()
		});
		this._calculateSizeAndPosition();
		this.setIsVisible(true);
	}

	removeNode(guid: number) {
		this.nodeMap.delete(guid)
		this._calculateSizeAndPosition()
		this.setIsVisible(true)
	}

	hasNode(guid: number) {
		return this.nodeMap.has(guid)
	}
	private setIsVisible(value: boolean) {
		this.isVisible = value;
		this.emit('change_visible', this)
	}

	clearNodeList() {
		this.nodeMap = new Map()
		this.setIsVisible(false)
		this.size.set(0, 0)
	}

	startNodeMutation() {
		// this._updateNodePreviousMatrix()
	}

	endNodeMutation() {
		this._updateNodePreviousMatrix()
	}

	private _updateNodePreviousMatrix() {
		this.nodeMap.forEach((value, guid) => {
			const { node, prevMatrix, prevSize } = this.nodeMap.get(guid)
			prevMatrix.copy(node.localMatrix)
			prevSize.copyFrom(node.size)
		})
	}

	private _calculateSizeAndPosition() {
		if (this.nodeMap.size > 1) {
			const { minX, maxX, minY, maxY } = this.calculateSizeService.calculateSizeMultiLayer(this.nodeMap)

			this.setSize(maxX - minX, maxY - minY)
			this.geometry.updateGeometry(this.size)

			this.localMatrix.identity()
			this.localMatrix.setPosition(minX, minY)
			this.needUpdateMatrix = true

		} else if (this.nodeMap.size == 1) {
			const {node} = Array.from(this.nodeMap.values())[0]

			this.setSize(node.size.x, node.size.y)
			this.geometry.updateGeometry(this.size)

			this.localMatrix.copy(node.localMatrix)
			this.needUpdateMatrix = true
		}
		this.emit('update', this)
	}

	//OVERRIDE
	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.copy(this.localMatrix)
			this.inverseWorldMatrix.copy(this.worldMatrix).setPosition(0, 0).invert()
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
		}
		return this.worldMatrix
	}
}

class CalculateSizeService {
	leftTop = new Vector2();
	rightTop = new Vector2();
	rightBottom = new Vector2();
	leftBottom = new Vector2();

	calculateSizeMultiLayer(nodeList:Map<number, {
		node: Node<BufferGeometry>;
		prevMatrix: Matrix3;
	}>) {


		let minX = 0;
		let minY = 0;
		let maxX = 0;
		let maxY = 0;
	
		nodeList.forEach(({ node }) => {
	
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