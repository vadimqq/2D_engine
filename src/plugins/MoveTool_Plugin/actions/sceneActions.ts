import { ActionsType } from "../model"

export const sceneActions: ActionsType = {
    onPointerDown: ({controlNode}) => {
        controlNode.clearNodeList()
    },
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: () => {},
    onDragEnd: () => {},
}