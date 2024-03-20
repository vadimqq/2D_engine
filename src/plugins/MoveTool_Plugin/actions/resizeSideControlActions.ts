import { RESIZE_SIDE_CONTROL_TYPE, ResizeSideControl } from "../../../controlNode/ResizeSideControls/ResizeSideControl";
import { Vector2 } from "../../../math/Vector2";
import { ActionsType } from "../model";

export const resizeSideControlActions: ActionsType & { positionOffset: Vector2; } = {
    positionOffset: new Vector2(),
    onPointerDown: () => {},
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: ({intersect , controlNode, event, startMousePosition}) => {
        const control = intersect as ResizeSideControl;

        const sizeChange = event.scenePosition
            .sub(startMousePosition)
            .round()
            .applyMatrix3(controlNode.inverseWorldMatrix)
            .multiply(control.sizeMultiplier);

        switch (control.instrumentType) {
			case RESIZE_SIDE_CONTROL_TYPE.LEFT:
				resizeSideControlActions.positionOffset.set(-sizeChange.x, 0)
				break;
			case RESIZE_SIDE_CONTROL_TYPE.TOP:
				resizeSideControlActions.positionOffset.set(0, -sizeChange.y)
			break;
			case RESIZE_SIDE_CONTROL_TYPE.RIGHT:
				resizeSideControlActions.positionOffset.set(0, 0)
			break;
            case RESIZE_SIDE_CONTROL_TYPE.BOTTOM:
				resizeSideControlActions.positionOffset.set(-sizeChange.x, 0)
			break;
			default:
				break;
		}
        controlNode.applyScale(
            sizeChange,
            resizeSideControlActions.positionOffset
        )
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}