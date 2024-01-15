import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import { BufferGeometry } from './BufferGeometry';
import { Color } from './Color';

export class Object2D {
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();
	needUpdateMatrix = true;

	position = new Vector2(0, 0);
	rotation = 0;
	scale = new Vector2(1, 1);
	
	parent: Object2D | null = null;
	children: Object2D[] = [];

	geometry: BufferGeometry;

	color: Color;

	constructor(geometry: BufferGeometry, color: Color) {
		this.geometry = geometry;
		this.color = color;
	}

	setRotation(angle: number) {
		this.rotation = angle
		this.needUpdateMatrix = true
	}
	setPosition(vector: Vector2) {
		this.position = vector
		this.needUpdateMatrix = true
	}
	setScale(vector: Vector2) {
		this.scale = vector
		this.needUpdateMatrix = true
	}

	getWidth() { return 0 }
	getHeight() { return 0 }

	add(object: Object2D) {
		if (object.parent !== null) {
			object.parent.remove(object);
		}
		object.parent = this;
		this.children.push(object);
	}
	remove(object: Object2D) {
		const index = this.children.indexOf( object );
		if (index !== - 1) {
			object.parent = null;
			this.children.splice( index, 1 );
		}
	}
	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.identity()
			
			if (this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix)
			}
			this.computedLocalMatrix()
			this.worldMatrix.multiply(this.localMatrix)
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
		}
		return this.worldMatrix
	}
	private computedLocalMatrix() {
		const width = this.getWidth();
		const height = this.getHeight()
		this.localMatrix.identity()

		this.localMatrix.translate(this.position.x, this.position.y);
		//вращение от центра------------------------------
		this.localMatrix.translate(width / 2, height /2)
		this.localMatrix.rotate(this.rotation);
		this.localMatrix.translate(-width / 2, -height / 2)
		//------------------------------------------------
		this.localMatrix.scale(this.scale.x, this.scale.y)

		return this.localMatrix
	}
}
