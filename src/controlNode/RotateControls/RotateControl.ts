import { Camera } from "../../camera/Camera";
import { Color } from "../../core/Color";
import { RectangleGeometry } from "../../core/Geometry";
import { Node } from "../../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../../core/Node/model";
import { Vector2 } from "../../math/Vector2";
import { SHADER_TYPE } from "../../rendering/const";

export enum ROTATE_CONTROL_TYPE {
    LEFT_TOP = 'LEFT_TOP',
    RIGHT_TOP = 'RIGHT_TOP',
    RIGHT_BOTTOM = 'RIGHT_BOTTOM',
    LEFT_BOTTOM = 'LEFT_BOTTOM',
}

const sizeX = 20;
const sizeY = 15;


export class RotateControl extends Node<RectangleGeometry> {
    instrumentType: ROTATE_CONTROL_TYPE;
    sizeMultiplier: Vector2;
    constructor(type: ROTATE_CONTROL_TYPE) {
        super({
            geometry: new RectangleGeometry(sizeX, sizeY),
            color: new Color({
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            }),
            systemType: NODE_SYSTEM_TYPE.ROTATE_CONTROL,
            shaderType: SHADER_TYPE.PRIMITIVE,
        })
        this.instrumentType = type
        this.size.set(sizeX, sizeY)

        switch (this.instrumentType) {
            case ROTATE_CONTROL_TYPE.LEFT_TOP:
                this.sizeMultiplier = new Vector2(-1, -1)
                break;
            case ROTATE_CONTROL_TYPE.RIGHT_TOP:
                this.sizeMultiplier = new Vector2(1, -1)

                break;
            case ROTATE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.sizeMultiplier = new Vector2(1, 1)

                break;
            case ROTATE_CONTROL_TYPE.LEFT_BOTTOM:
                this.sizeMultiplier = new Vector2(-1, 1)
                break;
            default:
                break;
        }
    }

    init() {
        this.updatePosition()
    }

    update() {
        this.updatePosition()
    }

    updatePosition() {
        this.localMatrix.identity()
        const halfSizeX = this.size.x / 2;

        switch (this.instrumentType) {
            case ROTATE_CONTROL_TYPE.LEFT_TOP:
                this.localMatrix.rotate(Math.PI / 4)
                this.localMatrix.translate(-halfSizeX, -this.size.y)
                break;
            case ROTATE_CONTROL_TYPE.RIGHT_TOP:
                this.localMatrix.translate(this.parent.size.x, 0)
                this.localMatrix.rotate(-Math.PI / 4)
                this.localMatrix.translate(-halfSizeX, -this.size.y)

                break;
            case ROTATE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.localMatrix.translate(this.parent.size.x, this.parent.size.y)
                this.localMatrix.rotate(Math.PI / 4)
                this.localMatrix.translate(-halfSizeX, 0)
                break;
            case ROTATE_CONTROL_TYPE.LEFT_BOTTOM:
                this.localMatrix.translate(0, this.parent.size.y)
                this.localMatrix.rotate(-Math.PI / 4)
                this.localMatrix.translate(-halfSizeX, 0)


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
        this.size.set(sizeX / camera.zoom, sizeY / camera.zoom)

        this.geometry.updateGeometry(this.size)
        this.updatePosition()
        this.needUpdateMatrix = true; //TODO подумать как обновлять матрицу реже
    }
}