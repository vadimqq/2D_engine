import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Color } from "../core/Color";
import { Node } from "../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../core/Node/model";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { SHADER_TYPE } from "../rendering/const";
import { RESIZE_CONTROL_TYPE } from "./ResizeControls/ResizeControl";
import { ResizeVertexControlManager } from "./ResizeControls/ResizeInstrumentManager";
import { RotateVertexControlManager } from "./RotateControls/RotateInstrumentManager";
import { ControlNodeGeometry } from "./controlNodeGeometry";


interface ControlNodeEvents {
	'update': [node: ControlNode];
	'change_visible': [node: ControlNode];
}
export class ControlNode extends Node<ControlNodeGeometry> {
	shaderType: string;
	isVisible = false;
	inverseWorldMatrix = new Matrix3();
	centerVector = new Vector2();
	private calculateSizeService = new CalculateSizeService();
	private resizeVertexControlManager: ResizeVertexControlManager;
	private rotateVertexControlManager: RotateVertexControlManager;


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
			shaderType: SHADER_TYPE.PRIMITIVE_OUTLINE,
		});
		this.rotateVertexControlManager = new RotateVertexControlManager(this);
		this.rotateVertexControlManager.init()

		this.resizeVertexControlManager = new ResizeVertexControlManager(this);
		this.resizeVertexControlManager.init()
	}

	setRotation(angle: number, offset: Vector2) {
		if (this.nodeMap.size > 1) {
			this.nodeMap.forEach(({node, prevMatrix}) => {
				node.localMatrix
				.identity()
				.translate(offset.x, offset.y)
				.rotate(angle)
				.translate(-offset.x, -offset.y)
				.multiply(prevMatrix);
				node.needUpdateMatrix = true;
			});
		} else {
			const {node, prevMatrix} = this.nodeMap.values().next().value;
			node.localMatrix.copy(prevMatrix)
			.translate(node.size.x / 2, node.size.y / 2)
			.rotate(angle)
			.translate(-node.size.x / 2, -node.size.y / 2);

			node.needUpdateMatrix = true;
		}
		this._calculateSizeAndPosition()
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
			this.nodeMap.forEach(({node, prevSize, prevMatrix}) => {
				const newSizeX = prevSize.x + vector.x
				const newSizeY = prevSize.y + vector.y

				const xMulti = newSizeX > 0 ? 1: -1;
				const yMulti = newSizeY > 0 ? 1: -1;
				node.localMatrix.copy(prevMatrix).scale(xMulti, yMulti).translate(positionAdj.x * xMulti, positionAdj.y * yMulti);
				node.setSize(Math.abs(newSizeX), Math.abs(newSizeY))
				node.needUpdateMatrix = true
			});
		} else {
			const { node, prevSize, prevMatrix } = this.nodeMap.values().next().value;
			const newSizeX = prevSize.x + vector.x
			const newSizeY = prevSize.y + vector.y

			const xMulti = newSizeX > 0 ? 1: -1;
			const yMulti = newSizeY > 0 ? 1: -1;
			node.localMatrix.copy(prevMatrix).scale(xMulti, yMulti).translate(positionAdj.x * xMulti, positionAdj.y * yMulti);
			node.setSize(Math.abs(newSizeX), Math.abs(newSizeY))
			node.needUpdateMatrix = true
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
		this.updateInverseWorldMatrix();
	}

	removeNode(guid: number) {
		this.nodeMap.delete(guid)
		this._calculateSizeAndPosition()
		this.setIsVisible(true)
		this.updateInverseWorldMatrix();
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
		this.updateInverseWorldMatrix()
	}

	updateInverseWorldMatrix() {
		this.inverseWorldMatrix.copy(this.computeWorldMatrix()).setPosition(0, 0).invert()
	}

	private _updateNodePreviousMatrix() {
		this.nodeMap.forEach((value, guid) => {
			const { node, prevMatrix, prevSize } = this.nodeMap.get(guid)
			prevMatrix.copy(node.localMatrix)
			prevSize.copy(node.size)
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

		this.centerVector
		.copy(this.size)
		.divideScalar(2)
		.applyMatrix3(this.localMatrix);

		this.emit('update', this)
	}

	//OVERRIDE
	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.copy(this.localMatrix)
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