import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry"
import { Color } from "../../core/Color"
import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node"
import { SHADER_TYPE } from "../../rendering/const"

export class ResizeControl extends Node<BufferGeometry> {

    constructor() {
        super({
            geometry: new BufferGeometry(),
            color: new Color({
                r: 190 / 255,
                g: 190 / 255,
                b: 190 / 255,
                a: 1,
            }),
            systemType: NODE_SYSTEM_TYPE.EFFECT,
            shaderType: SHADER_TYPE.CONTROL_PRIMITIVE_SHADER
        })
        this.instrumentType = type
        this.size.set(size, size)
    }

    init() {
        this.updatePosition()
    }

    update() {
        this.updatePosition()
    }

    updatePosition() {
        this.localMatrix.identity()
        switch (this.instrumentType) {
            case RESIZE_CONTROL_TYPE.LEFT_TOP:
                this.localMatrix.translate(0, 0)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_TOP:
                this.parent.size.x
                this.localMatrix.translate(this.parent.size.x, 0)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.localMatrix.translate(this.parent.size.x, this.parent.size.y)
                break;
            case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
                this.localMatrix.translate(0, this.parent.size.y)
                break;
            default:
                break;
        }
    }
    // override
    computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.identity()
			if (this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix)
			}
			this.worldMatrix.multiply(this.localMatrix)
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
            this.worldMatrix.scale(1, 1)
		}
		return this.worldMatrix
	}
    beforeRender(camera: Camera): void {
        const vec = this.size.clone().set(this.size.x / camera.zoom, this.size.y / camera.zoom)
        this.geometry.updateGeometry(vec)
    }
}