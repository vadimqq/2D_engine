import { ControlNode } from "../controlNode";
import { RESIZE_SIDE_CONTROL_TYPE, ResizeSideControl } from "./ResizeSideControl";


export class ResizeSideControlsManager{
    leftControl: ResizeSideControl
    topControl: ResizeSideControl
    rightControl: ResizeSideControl
    bottomControl: ResizeSideControl

    constructor(controlNode: ControlNode) {
		this.leftControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.LEFT)
        controlNode.add_child(this.leftControl)
		this.topControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.TOP)
        controlNode.add_child(this.topControl)
		this.rightControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.RIGHT)
        controlNode.add_child(this.rightControl)
		this.bottomControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.BOTTOM)
        controlNode.add_child(this.bottomControl)

        this._on_update = this._on_update.bind(this);
        controlNode.addListener('update', this._on_update)
    }

    init() {
        this.leftControl.init()
		this.topControl.init()
		this.rightControl.init()
		this.bottomControl.init()
    }

    _on_update() {
        this.leftControl.update()
		this.topControl.update()
		this.rightControl.update()
		this.bottomControl.update()
    }
}