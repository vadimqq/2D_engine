import { ROTATE_CONTROL_TYPE, RotateControl } from "../../../controlNode/RotateControls/RotateControl";
import { ControlNode } from "../../../controlNode/controlNode";
import { Node } from "../../../core/Node/Node";
import { CursorStyleManager } from "../../../core/ToolManager/CursorManager";
import { Vector2 } from "../../../math/Vector2";
import { cursorGetter } from "../cursorGetter";
import { ActionsType, CURSOR_TYPE } from "../model";

export const rotateControlActions: ActionsType & {startAngle: number; rotateVector: Vector2; rotateOffsetVector: Vector2 } = {
    startAngle: 0,
    rotateVector: new Vector2(),
    rotateOffsetVector: new Vector2(),
    onPointerDown: ({controlNode, startMousePosition}) => {
        rotateControlActions.rotateOffsetVector
            .copy(controlNode.size)
            .divideScalar(2)
            .applyMatrix3(controlNode.worldMatrix);
        const vec = startMousePosition.clone().sub(rotateControlActions.rotateOffsetVector).applyMatrix3(controlNode.inverseWorldMatrix)
        rotateControlActions.startAngle = Math.atan2(vec.y, vec.x);
    },
    onPointerUp: () => {},
    onPointerMove: ({ intersect, cursorStyleManager, controlNode }) => {
        setRotateCursor(intersect, cursorStyleManager, controlNode)
    },
    onDrag: ({ intersect, cursorStyleManager, controlNode, event }) => {
        rotateControlActions.rotateVector.copy(event.scenePosition).sub(rotateControlActions.rotateOffsetVector).applyMatrix3(controlNode.inverseWorldMatrix)
        const currentAngle = Math.atan2(
            rotateControlActions.rotateVector.y,
            rotateControlActions.rotateVector.x,
          );
    
        controlNode.setRotation(rotateControlActions.startAngle - currentAngle, rotateControlActions.rotateOffsetVector);
        setRotateCursor(intersect, cursorStyleManager, controlNode);
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}

const setRotateCursor = (intersect: Node, cursorStyleManager: CursorStyleManager, controlNode: ControlNode) => {
    const control = intersect as RotateControl;
    let rotate = 0
    switch (control.instrumentType) {
        case ROTATE_CONTROL_TYPE.RIGHT_TOP:
            rotate = 90;
            break;
        case ROTATE_CONTROL_TYPE.RIGHT_BOTTOM:
            rotate = 180;
            break;
        case ROTATE_CONTROL_TYPE.LEFT_BOTTOM:
            rotate = -90;
            break;
        default:
            break;
    }
    cursorStyleManager.setCursor(CURSOR_TYPE.ROTATE, cursorGetter.getRotateCursor(rotate - controlNode.worldMatrix.getDegreeAngle()))
}