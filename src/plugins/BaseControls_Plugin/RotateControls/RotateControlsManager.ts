import { ControlNode } from "../../../controlNode/controlNode";
import { IControlsManager } from "../../../controlNode/model";
import { ROTATE_CONTROLS_NAME } from "../model";
import { ROTATE_CONTROL_TYPE, RotateControl } from "./RotateControl";

export class RotateControlsManager implements IControlsManager {
    name = ROTATE_CONTROLS_NAME;
    leftTopControl: RotateControl;
    rightTopControl: RotateControl;
    rightBottomControl: RotateControl;
    leftBottomControl: RotateControl;

    constructor() {
        this._on_update = this._on_update.bind(this);
    }

    init(controlNode: ControlNode) {
        this.leftTopControl = new RotateControl(ROTATE_CONTROL_TYPE.LEFT_TOP, this.name)
        controlNode.add_child(this.leftTopControl)
        this.leftTopControl.init()

		this.rightTopControl = new RotateControl(ROTATE_CONTROL_TYPE.RIGHT_TOP, this.name)
        controlNode.add_child(this.rightTopControl)
		this.rightTopControl.init()

		this.rightBottomControl = new RotateControl(ROTATE_CONTROL_TYPE.RIGHT_BOTTOM, this.name)
        controlNode.add_child(this.rightBottomControl)
		this.rightBottomControl.init()

		this.leftBottomControl = new RotateControl(ROTATE_CONTROL_TYPE.LEFT_BOTTOM, this.name)
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