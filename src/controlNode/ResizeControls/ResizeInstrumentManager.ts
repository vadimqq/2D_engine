import { ControlNode } from "../controlNode";
import { RESIZE_CONTROL_TYPE, ResizeControl } from "./resizeControl";

export class ResizeVertexControlManager{
    leftTopControl: ResizeControl
    rightTopControl: ResizeControl
    rightBottomControl: ResizeControl
    leftBottomControl: ResizeControl

    constructor(controlNode: ControlNode) {
		this.leftTopControl = new ResizeControl(RESIZE_CONTROL_TYPE.LEFT_TOP)
        controlNode.add_child(this.leftTopControl)
		this.rightTopControl = new ResizeControl(RESIZE_CONTROL_TYPE.RIGHT_TOP)
        controlNode.add_child(this.rightTopControl)
		this.rightBottomControl = new ResizeControl(RESIZE_CONTROL_TYPE.RIGHT_BOTTOM)
        controlNode.add_child(this.rightBottomControl)
		this.leftBottomControl = new ResizeControl(RESIZE_CONTROL_TYPE.LEFT_BOTTOM)
        controlNode.add_child(this.leftBottomControl)

        this._on_update = this._on_update.bind(this);

        controlNode.addListener('_on_update', this._on_update)
    }

    init() {
        this.leftTopControl.init()
		this.rightTopControl.init()
		this.rightBottomControl.init()
		this.leftBottomControl.init()
    }

    _on_update() {
        this.leftTopControl.update()
		this.rightTopControl.update()
		this.rightBottomControl.update()
		this.leftBottomControl.update()
    }
}