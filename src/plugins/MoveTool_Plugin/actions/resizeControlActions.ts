import { ResizeControl } from "../../../controlNode/ResizeControls/ResizeControl";
import { ActionsType } from "../model";

export const resizeControlActions: ActionsType = {
    onPointerDown: () => {},
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: ({intersect , controlNode, event, startMousePosition}) => {
        const control = intersect as ResizeControl;
        controlNode.setScale(
            event.scenePosition.
            sub(startMousePosition)
            .multiply(control.sizeMultiplier)
            .round()
            .applyMatrix3(controlNode.inverseWorldMatrix),
            control.instrumentType
        )
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}