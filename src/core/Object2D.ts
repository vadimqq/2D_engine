import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';

export class Object2D {
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();

	position = new Vector2(0, 0);
	rotation = 0;
	scale = new Vector2(1, 1);
	
	parent: Object2D | null = null;
	children: Object2D[] = [];
	constructor() {}
	setRotation(angle: number) {
		this.rotation = angle
	}
	setPosition(vector: Vector2) {
		this.position = vector
	}
	setScale(vector: Vector2) {
		this.scale = vector
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
		this.worldMatrix.identity()
		
		if (this.parent) {
			this.worldMatrix.multiply(this.parent.worldMatrix)
		}
		this.computedLocalMatrix()
		this.worldMatrix.multiply(this.localMatrix)
	}
	computedLocalMatrix() {
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

		// this.localMatrix.set(
		// 	0.97842824459075928, -0.20658683776855469, 0,
		// 	0.90012037754058838, 0.43564122915267944, 0,
		// 	100, 100, 1
		// )
		return this.localMatrix
	}
}
