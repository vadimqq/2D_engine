import EventEmitter from 'eventemitter3';
import { Matrix3 } from '../../math/Matrix3';
import { Vector2 } from '../../math/Vector2';
import { Color } from '../Color';
import { EVENTS_NAME, NodeEvents } from './model';

export class Node<G>  extends EventEmitter<NodeEvents>{
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();
	needUpdateMatrix = true;
	size = new Vector2(1, 1)
	
	parent: Node<G> | null = null;
	children: Node<G>[] = [];
	hitArea = null; // Область фигуры для поиска пересечений

	geometry: G;
	color: Color;

	constructor(geometry: G, color: Color) {
		super();
		this.geometry = geometry;
		this.color = color;
	}

	add_child(object: Node<G>) {
		if (object.parent !== null) {
			object.parent.remove_child(object);
		}
		object.parent = this;
		this.children.push(object);
		this.emit(EVENTS_NAME.CHILD_ADDED, object, this, this.children.length - 1);
        object.emit(EVENTS_NAME.ADDED, this);
	}

	remove_child(object: Node<G>) {
		const index = this.children.indexOf( object );
		if (index > -1) {
			this.children.splice( index, 1 );
			object.parent = null;
			this.emit(EVENTS_NAME.CHILD_REMOVED, object, this, index);
			object.emit(EVENTS_NAME.REMOVED, this);
		}
	}

	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.identity()
			if (this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix)
			}
			this.worldMatrix.multiply(this.localMatrix)
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
		}
		return this.worldMatrix
	}

	getWorldPosition() {
		return new Vector2(this.worldMatrix.elements[2], this.worldMatrix.elements[5])
	}
}
