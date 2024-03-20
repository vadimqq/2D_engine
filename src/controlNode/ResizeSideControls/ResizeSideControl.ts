import { Camera } from "../../camera/Camera";
import { Color } from "../../core/Color";
import { RectangleGeometry } from "../../core/Geometry";
import { Node } from "../../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../../core/Node/model";
import { Vector2 } from "../../math/Vector2";
import { SHADER_TYPE } from "../../rendering/const";


export enum RESIZE_SIDE_CONTROL_TYPE {
    LEFT = 'LEFT',
    TOP = 'TOP',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
}

const width = 10;
export class ResizeSideControl extends Node<RectangleGeometry> {
    instrumentType: RESIZE_SIDE_CONTROL_TYPE;
    sizeMultiplier: Vector2;
    constructor(type: RESIZE_SIDE_CONTROL_TYPE) {
        super({
            geometry: new RectangleGeometry(width, width),
            color: new Color({
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            }),
            systemType: NODE_SYSTEM_TYPE.RESIZE_SIDE_CONTROL,
            shaderType: SHADER_TYPE.PRIMITIVE
        })
        this.instrumentType = type
        this.size.set(width, width)

        switch (this.instrumentType) {
            case RESIZE_SIDE_CONTROL_TYPE.LEFT:
                this.sizeMultiplier = new Vector2(-1, 0)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.TOP:
                this.sizeMultiplier = new Vector2(0, -1)

                break;
            case RESIZE_SIDE_CONTROL_TYPE.RIGHT:
                this.sizeMultiplier = new Vector2(1, 0)

                break;
            case RESIZE_SIDE_CONTROL_TYPE.BOTTOM:
                this.sizeMultiplier = new Vector2(0, 1)
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
        const halfWidth = this.size.x / 2;
        const halfHeight = this.size.y / 2;

        switch (this.instrumentType) {
            case RESIZE_SIDE_CONTROL_TYPE.LEFT:
                this.localMatrix.translate(-halfWidth, 0)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.TOP:
                this.localMatrix.translate(0, -halfHeight)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.RIGHT:
                this.localMatrix.translate(this.parent.size.x - halfWidth, 0)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.BOTTOM:
                this.localMatrix.translate(0, this.parent.size.y - halfHeight)
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
        this.size.set(width / camera.zoom, width / camera.zoom)
        switch (this.instrumentType) {
            case RESIZE_SIDE_CONTROL_TYPE.LEFT:
                this.size.set(width / camera.zoom, this.parent.size.y)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.TOP:
                this.size.set(this.parent.size.x, width / camera.zoom)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.RIGHT:
                this.size.set(width / camera.zoom, this.parent.size.y)
                break;
            case RESIZE_SIDE_CONTROL_TYPE.BOTTOM:
                this.size.set(this.parent.size.x, width / camera.zoom)
                break;
            default:
                break;
        }

        this.geometry.updateGeometry(this.size)
        this.updatePosition()
        this.needUpdateMatrix = true; //TODO подумать как обновлять матрицу реже
    }
}