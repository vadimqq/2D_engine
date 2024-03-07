import { Camera } from "../../camera/Camera";
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Color } from "../../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { Vector2 } from "../../math/Vector2";
import { SHADER_TYPE } from "../../rendering/const";

export class ControlGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = { numComponents: 2, data: [-x, -y, x, -y, x, y, -x, y], };
        this.indices =  { numComponents: 2, data: [0, 1, 2, 0, 2, 3, ]};

    }
    updateGeometry(size: Vector2) {
        this.position = { numComponents: 2, data: [-size.x, -size.y, size.x, -size.y, size.x, size.y, -size.x, size.y], };
    }
}

export enum RESIZE_CONTROL_TYPE {
    LEFT_TOP = 'LEFT_TOP',
    RIGHT_TOP = 'RIGHT_TOP',
    RIGHT_BOTTOM = 'RIGHT_BOTTOM',
    LEFT_BOTTOM = 'LEFT_BOTTOM',
}

export class ResizeControl extends Node<ControlGeometry> {
    instrumentType: RESIZE_CONTROL_TYPE;

    constructor(type: RESIZE_CONTROL_TYPE) {
        super({
            geometry: new ControlGeometry(5, 5),
            color: new Color({
                r: 190 / 255,
                g: 190 / 255,
                b: 190 / 255,
                a: 1,
            }),
            systemType: NODE_SYSTEM_TYPE.CONTROL_NODE,
            shaderType: SHADER_TYPE.PRIMITIVE
        })
        this.instrumentType = type
        this.size.set(5, 5)
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