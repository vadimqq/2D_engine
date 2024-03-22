import { ControlNode } from "../../../controlNode/controlNode";
import { IControlsManager } from "../../../controlNode/model";
import { RECTANGLE_RADIUS_CONTROLS_NAME } from "../model";
import { RadiusControl, ROTATE_CONTROL_TYPE } from "./RadiusControl";

export class RadiusControlsManager implements IControlsManager {
    name = RECTANGLE_RADIUS_CONTROLS_NAME;
    leftTopControl: RadiusControl
    rightTopControl: RadiusControl
    rightBottomControl: RadiusControl
    leftBottomControl: RadiusControl

    constructor() {
        this._on_update = this._on_update.bind(this);
    }

    init(controlNode: ControlNode) {
        this.leftTopControl = new RadiusControl(ROTATE_CONTROL_TYPE.LEFT_TOP, this.name)
        controlNode.add_child(this.leftTopControl)
        this.leftTopControl.init()

		this.rightTopControl = new RadiusControl(ROTATE_CONTROL_TYPE.RIGHT_TOP, this.name)
        controlNode.add_child(this.rightTopControl)
		this.rightTopControl.init()

		this.rightBottomControl = new RadiusControl(ROTATE_CONTROL_TYPE.RIGHT_BOTTOM, this.name)
        controlNode.add_child(this.rightBottomControl)
		this.rightBottomControl.init()

		this.leftBottomControl = new RadiusControl(ROTATE_CONTROL_TYPE.LEFT_BOTTOM, this.name)
        controlNode.add_child(this.leftBottomControl)
		this.leftBottomControl.init()

        this.setIsVisibleControls(false)
        controlNode.addListener('update', this._on_update)

    }

    _on_update() {
        this.leftTopControl.update()
		this.rightTopControl.update()
		this.rightBottomControl.update()
		this.leftBottomControl.update()
    }

    setIsVisibleControls(value: boolean) {
        this.leftTopControl.setIsVisible(value)
		this.rightTopControl.setIsVisible(value)
		this.rightBottomControl.setIsVisible(value)
		this.leftBottomControl.setIsVisible(value)
    }
}