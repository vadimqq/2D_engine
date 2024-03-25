import { ControlNode } from "../../../controlNode/controlNode";
import { IControlsManager } from "../../../controlNode/model";
import { RESIZE_SIDE_CONTROLS_NAME } from "../model";
import { RESIZE_SIDE_CONTROL_TYPE, ResizeSideControl } from "./ResizeSideControl";


export class ResizeSideControlsManager implements IControlsManager {
    name = RESIZE_SIDE_CONTROLS_NAME;
    leftControl: ResizeSideControl
    topControl: ResizeSideControl
    rightControl: ResizeSideControl
    bottomControl: ResizeSideControl

    constructor() {
        this._on_update = this._on_update.bind(this);
    }

    init(controlNode: ControlNode) {
        this.leftControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.LEFT, this.name)
        controlNode.add_child(this.leftControl)
        this.leftControl.init()

		this.topControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.TOP, this.name)
        controlNode.add_child(this.topControl)
        this.topControl.init()

		this.rightControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.RIGHT, this.name)
        controlNode.add_child(this.rightControl)
		this.rightControl.init()

		this.bottomControl = new ResizeSideControl(RESIZE_SIDE_CONTROL_TYPE.BOTTOM, this.name)
        controlNode.add_child(this.bottomControl)
		this.bottomControl.init()

        controlNode.addListener('update', this._on_update)
    }

    _on_update() {
        this.leftControl.update()
		this.topControl.update()
		this.rightControl.update()
		this.bottomControl.update()
    }
}