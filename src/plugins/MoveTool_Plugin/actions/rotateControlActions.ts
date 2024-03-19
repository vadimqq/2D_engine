import { Vector2 } from "../../../math/Vector2";
import { ActionsType } from "../model";

export const rotateControlActions: ActionsType & {startAngle: number; rotateVector: Vector2; rotateOffsetVector: Vector2 } = {
    startAngle: 0,
    rotateVector: new Vector2(),
    rotateOffsetVector: new Vector2(),
    onPointerDown: ({controlNode, startMousePosition}) => {
        const vec = startMousePosition.clone().sub(controlNode.centerVector).applyMatrix3(controlNode.inverseWorldMatrix)
        rotateControlActions.startAngle = Math.atan2(vec.y, vec.x);
        rotateControlActions.rotateOffsetVector.copy(controlNode.centerVector)
    },
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: ({ controlNode, event }) => {
        rotateControlActions.rotateVector.copy(event.scenePosition).sub(rotateControlActions.rotateOffsetVector).applyMatrix3(controlNode.inverseWorldMatrix)
        const currentAngle = Math.atan2(
            rotateControlActions.rotateVector.y,
            rotateControlActions.rotateVector.x,
          );
    
        controlNode.setRotation(rotateControlActions.startAngle - currentAngle, rotateControlActions.rotateOffsetVector)
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
}