import { ControlNode } from "../../../controlNode/controlNode";
import { IControlsManager } from "../../../controlNode/model";
import { RESIZE_CONTROLS_NAME } from "../model";
import { RESIZE_CONTROL_TYPE, ResizeControl } from "./ResizeControl";

export class ResizeControlsManager implements IControlsManager {
    name = RESIZE_CONTROLS_NAME;
    leftTopControl: ResizeControl;
    rightTopControl: ResizeControl;
    rightBottomControl: ResizeControl;
    leftBottomControl: ResizeControl;

    constructor() {
        this._on_update = this._on_update.bind(this);
    }

    init(controlNode: ControlNode) {
        this.leftTopControl = new ResizeControl(RESIZE_CONTROL_TYPE.LEFT_TOP, this.name)
        controlNode.add_child(this.leftTopControl)
        this.leftTopControl.init()

		this.rightTopControl = new ResizeControl(RESIZE_CONTROL_TYPE.RIGHT_TOP, this.name)
        controlNode.add_child(this.rightTopControl)
		this.rightTopControl.init()

		this.rightBottomControl = new ResizeControl(RESIZE_CONTROL_TYPE.RIGHT_BOTTOM, this.name)
        controlNode.add_child(this.rightBottomControl)
        this.rightBottomControl.init()

		this.leftBottomControl = new ResizeControl(RESIZE_CONTROL_TYPE.LEFT_BOTTOM, this.name)
        controlNode.add_child(this.leftBottomControl)
		this.leftBottomControl.init()


        controlNode.addListener('update', this._on_update)
    }

    _on_update() {
        this.leftTopControl.update()
		this.rightTopControl.update()
		this.rightBottomControl.update()
		this.leftBottomControl.update()
    }
}