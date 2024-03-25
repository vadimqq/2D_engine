import { Vector2 } from "../../../../math/Vector2";
import { RESIZE_CONTROL_TYPE, ResizeControl } from "../../../BaseControls_Plugin/ResizeControls/ResizeControl";
import { cursorGetter } from "../../cursorGetter";
import { ActionsType, CURSOR_TYPE } from "../../model";

export const resizeControlActions: ActionsType & { positionOffset: Vector2; } = {
    positionOffset: new Vector2(),
    onPointerDown: () => {},
    onPointerUp: () => {},
    onPointerMove: ({intersect, cursorStyleManager, controlNode }) => {
        const control = intersect as ResizeControl;
        let rotate = 0
        switch (control.instrumentType) {
			case RESIZE_CONTROL_TYPE.LEFT_TOP:
				rotate = 45
				break;
			case RESIZE_CONTROL_TYPE.RIGHT_TOP:
				rotate = -45
			break;
			case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
				rotate = -45
			break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
				rotate = 45
			break;
			default:
				break;
		}
        cursorStyleManager.setCursor(CURSOR_TYPE.RESIZE, cursorGetter.getResizeCursor(rotate - controlNode.worldMatrix.getDegreeAngle()))
    },
    onDrag: ({intersect , controlNode, event, startMousePosition}) => {
        const control = intersect as ResizeControl;

        const sizeChange = event.scenePosition
            .sub(startMousePosition)
            .round()
            .applyMatrix3(controlNode.inverseWorldMatrix)
            .multiply(control.sizeMultiplier);

        switch (control.instrumentType) {
			case RESIZE_CONTROL_TYPE.LEFT_TOP:
				resizeControlActions.positionOffset.set(-sizeChange.x, -sizeChange.y)
				break;
			case RESIZE_CONTROL_TYPE.RIGHT_TOP:
				resizeControlActions.positionOffset.set(0, -sizeChange.y)
			break;
			case RESIZE_CONTROL_TYPE.LEFT_BOTTOM:
				resizeControlActions.positionOffset.set(-sizeChange.x, 0)
			break;
            case RESIZE_CONTROL_TYPE.RIGHT_BOTTOM:
				resizeControlActions.positionOffset.set(0, 0)
			break;
			default:
				break;
		}
        controlNode.applyScale(
            sizeChange,
            resizeControlActions.positionOffset
        )
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}