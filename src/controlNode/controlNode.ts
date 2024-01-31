import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Color } from "../core/Color";
import { Node } from "../core/Node/Node";
import { Vector2 } from "../math/Vector2";

export class ControlNode extends Node<BufferGeometry> {
	position = new Vector2(0, 0);
	rotation = 0;
	scale = new Vector2(1, 1);

	constructor() {
		super(new BufferGeometry(),
        new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 }));

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