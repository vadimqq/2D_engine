import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Color } from "../../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { RectangleGeometry } from "../../plugins/Rectangle_Plugin/geometry";

export class ControlGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = { numComponents: 2, data: [0, 0, x, 0, 0, y, x, y], };
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
            geometry: new RectangleGeometry(10, 10),
            color: new Color({
                r: 190 / 255,
                g: 190 / 255,
                b: 190 / 255,
                a: 1,
            }),
            systemType: NODE_SYSTEM_TYPE.CONTROL_NODE
        })
        this.instrumentType = type
        this.size.set(10, 10)
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
                this.localMatrix.translate(-5, -5)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_TOP:
                this.parent.size.x
                this.localMatrix.translate(this.parent.size.x - 5, -5)
                break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
                this.localMatrix.translate(this.parent.size.x - 5, this.parent.size.y - 5)
                break;
            case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
                this.localMatrix.translate(-5, this.parent.size.y - 5)
                break;
            default:
                break;
        }
    }
}