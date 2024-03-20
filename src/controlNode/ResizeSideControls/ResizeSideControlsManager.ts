import { ControlNode } from "../controlNode";
import { ResizeSideControl } from "./ResizeSideControl";


export class ResizeSideControlsManager{
    leftTopControl: ResizeSideControl
    rightTopControl: ResizeSideControl
    rightBottomControl: ResizeSideControl
    leftBottomControl: ResizeSideControl

    constructor(controlNode: ControlNode) {
		this.leftTopControl = new ResizeSideControl(RESIZE_CONTROL_TYPE.LEFT_TOP)
        controlNode.add_child(this.leftTopControl)
		this.rightTopControl = new ResizeSideControl(RESIZE_CONTROL_TYPE.RIGHT_TOP)
        controlNode.add_child(this.rightTopControl)
		this.rightBottomControl = new ResizeSideControl(RESIZE_CONTROL_TYPE.RIGHT_BOTTOM)
        controlNode.add_child(this.rightBottomControl)
		this.leftBottomControl = new ResizeSideControl(RESIZE_CONTROL_TYPE.LEFT_BOTTOM)
        controlNode.add_child(this.leftBottomControl)

        this._on_update = this._on_update.bind(this);

        controlNode.addListener('update', this._on_update)
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