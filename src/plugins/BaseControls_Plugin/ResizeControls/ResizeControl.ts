import { Camera } from "../../../camera/Camera";
import { Control } from "../../../controlNode/Control";
import { Color } from "../../../core/Color";
import { RectangleGeometry } from "../../../core/Geometry";
import { Vector2 } from "../../../math/Vector2";
import { SHADER_TYPE } from "../../../rendering/const";

export enum RESIZE_CONTROL_TYPE {
    LEFT_TOP = 'LEFT_TOP',
    RIGHT_TOP = 'RIGHT_TOP',
    RIGHT_BOTTOM = 'RIGHT_BOTTOM',
    LEFT_BOTTOM = 'LEFT_BOTTOM',
}

const size = 10;

export class ResizeControl extends Control<RectangleGeometry> {
    instrumentType: RESIZE_CONTROL_TYPE;
    sizeMultiplier: Vector2;
    constructor(type: RESIZE_CONTROL_TYPE, controlManagerName: string) {
        super({
            controlManagerName,
            geometry: new RectangleGeometry(size, size),
            color: new Color({
                r: 1,
                g: 1,
                b: 1,
                a: 1,
            }),
            shaderType: SHADER_TYPE.PRIMITIVE_OUTLINE
        })
        this.instrumentType = type
        this.size.set(size, size)

        switch (this.instrumentType) {
            case RESIZE_CONTROL_TYPE.LEFT_TOP:
                this.sizeMultiplier = new Vector2(-1, -1)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_TOP:
                this.sizeMultiplier = new Vector2(1, -1)

                break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.sizeMultiplier = new Vector2(1, 1)

                break;
            case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
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
        const halfSize = this.size.x / 2;
        switch (this.instrumentType) {
            case RESIZE_CONTROL_TYPE.LEFT_TOP:
                this.localMatrix.translate(-halfSize, -halfSize)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_TOP:
                this.localMatrix.translate(this.parent.size.x - halfSize, -halfSize)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.localMatrix.translate(this.parent.size.x -halfSize, this.parent.size.y - halfSize)
                break;
            case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
                this.localMatrix.translate(-halfSize, this.parent.size.y - halfSize)
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
        this.size.set(size / camera.zoom, size / camera.zoom)

        this.geometry.updateGeometry(this.size)
        this.updatePosition()
        this.needUpdateMatrix = true; //TODO подумать как обновлять матрицу реже
    }
}