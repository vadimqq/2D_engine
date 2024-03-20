import { ResizeControl } from "../../../controlNode/ResizeControls/ResizeControl";
import { ActionsType } from "../model";

export const resizeControlActions: ActionsType = {
    onPointerDown: () => {},
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: ({intersect , controlNode, event, startMousePosition}) => {
        const control = intersect as ResizeControl;
        controlNode.applyScale(
            event.scenePosition.
            sub(startMousePosition)
            .round()
            .applyMatrix3(controlNode.inverseWorldMatrix)
            .multiply(control.sizeMultiplier),
            control.instrumentType
        )
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}