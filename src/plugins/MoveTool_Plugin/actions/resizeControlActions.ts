import { RESIZE_CONTROL_TYPE, ResizeControl } from "../../../controlNode/ResizeControls/ResizeControl";
import { Vector2 } from "../../../math/Vector2";
import { ActionsType } from "../model";

export const resizeControlActions: ActionsType & { positionOffset: Vector2; } = {
    positionOffset: new Vector2(),
    onPointerDown: () => {},
    onPointerUp: () => {},
    onPointerMove: () => {},
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