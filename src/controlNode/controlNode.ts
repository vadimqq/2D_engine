import { Color } from "../core/Color";
import { RectangleGeometry } from "../core/Geometry";
import { Node } from "../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../core/Node/model";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { SHADER_TYPE } from "../rendering/const";
import { ClassType } from "../utils/models";
import { IControlsManager } from "./model";

interface ControlNodeEvents {
	'update': [node: ControlNode];
}
export class ControlNode extends Node<RectangleGeometry> {
	shaderType: string;
	inverseWorldMatrix = new Matrix3();//Без учета позиции, только скейл и поворот
	prevWorldMatrix = new Matrix3();// Мамтрица до начала трансформации
	prevSize = new Vector2();//Размер до начала трансформации

	private calculateSizeService = new CalculateSizeService();

	// baseControlsMap = new Map<string, IControlsManager>();
	nodeControlsMap = new Map<string, IControlsManager>();

	nodeMap = new Map<number,{
		node: Node;
		prevMatrix: Matrix3;
		prevSize: Vector2;
	}>();

	constructor() {
		super({
			type: 'CONTROL_NODE',
			geometry: new RectangleGeometry(),
        	color: new Color({ r: 1, g: 1, b: 1, a: 0 }),
			systemType: NODE_SYSTEM_TYPE.CONTROL_NODE,
			shaderType: SHADER_TYPE.PRIMITIVE_OUTLINE,
		});
		this.setIsVisible(false);
	}

	getFirstNode() {
		return this.nodeMap.values().next().value.node;
	}

	registerNewNodeControls(ControlsManagerClass: ClassType<IControlsManager>) {//TODO нужна типизация
		const newControlsManger = new ControlsManagerClass();

		if (this.nodeControlsMap.has(newControlsManger.name)) {
			console.warn(`Контрол менеджер ${newControlsManger.name} не может быть зарегестрирован, имя уже занято`)
		} else {
			this.nodeControlsMap.set(newControlsManger.name, new ControlsManagerClass())
			this.nodeControlsMap.get(newControlsManger.name).init(this)
		}
	}

	// registerNewBaseControls(name: string, ControlsManagerClass: ClassType<IControlsManager>) {//TODO нужна типизация
	// 	if (this.baseControlsMap.has(name)) {
	// 		console.warn(`Контрол ${name} не может быть зарегестрирован, имя уже занято`)
	// 	} else {
	// 		this.baseControlsMap.set(name, new ControlsManagerClass())
	// 		this.baseControlsMap.get(name).init(this)
	// 	}
	// }

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
	applyScale(vector: Vector2, positionOffset: Vector2) {

		if (this.nodeMap.size > 1) {
			const testChange = new Vector2(
				1 + vector.x / this.prevSize.x,
				1 + vector.y / this.prevSize.y

			)
			this.nodeMap.forEach(({ node, prevMatrix, prevSize }) => {
				const localMatrix = prevMatrix
				.clone()
				.setPosition(
					prevMatrix.elements[6] -
					this.prevWorldMatrix.elements[6],
					prevMatrix.elements[7] -
					this.prevWorldMatrix.elements[7],
				);		

				node.localMatrix
					.copy(this.prevWorldMatrix)
					.translate(positionOffset.x, positionOffset.y)
					.scale(testChange.x, testChange.y)
					.multiply(localMatrix)
				
				//TODO нужно найти точный способо декомпозиции матрицы на скейл и вращение!
				const decX = node.localMatrix.elements[0];
				const decY = node.localMatrix.elements[4];

				node.setSize(
					prevSize.x * decX,
					prevSize.y * decY
				)

				node.localMatrix.scale(1 / decX, 1 / decY);
				//! =======================================

				node.needUpdateMatrix = true
			});
		} else {
			const { node, prevSize, prevMatrix } = this.nodeMap.values().next().value;
			const newSizeX = prevSize.x + vector.x
			const newSizeY = prevSize.y + vector.y

			const xMulti = newSizeX > 0 ? 1: -1;
			const yMulti = newSizeY > 0 ? 1: -1;
			node.localMatrix.copy(prevMatrix).scale(xMulti, yMulti).translate(positionOffset.x * xMulti, positionOffset.y * yMulti);
			node.setSize(Math.abs(newSizeX), Math.abs(newSizeY))
			node.needUpdateMatrix = true
		}
		this._calculateSizeAndPosition()
	}

	addNode(node: Node) {
		this.nodeMap.set(node.guid, {
			node,
			prevMatrix: node.localMatrix.clone(),
			prevSize: node.size.clone()
		});
		
		this._calculateSizeAndPosition();
		this.setIsVisible(true);
		this.updateTransformInfo();
	}

	removeNode(guid: number) {
		this.nodeMap.delete(guid)
		this._calculateSizeAndPosition()
		this.setIsVisible(true)
		this.updateTransformInfo();
	}

	hasNode(guid: number) {
		return this.nodeMap.has(guid)
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
		this.updateTransformInfo()
	}

	updateTransformInfo() {
		this.computeWorldMatrix()
		this.prevSize.copy(this.size)
		this.prevWorldMatrix.copy(this.worldMatrix)
		this.inverseWorldMatrix.copy(this.worldMatrix).invert().setPosition(0, 0)
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
		node: Node;
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