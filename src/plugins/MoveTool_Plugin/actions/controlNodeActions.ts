import { ActionsType } from "../model";

export const controlNodeActions: ActionsType = {
    onDrag: ({controlNode, event, startMousePosition}) => {
        controlNode.setPosition(event.scenePosition.sub(startMousePosition).round())
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
    onPointerUp: ({event, controlNode}) => {
        const graphicsNode = event.getFirstGraphicsNode();
        if (event.shiftKey) {
            if (controlNode.hasNode(graphicsNode.guid)) {
                controlNode.removeNode(graphicsNode.guid)
            } else {
                controlNode.addNode(graphicsNode)
            }
        } else {
            controlNode.clearNodeList()
            controlNode.addNode(graphicsNode)
        }
    },

    onPointerDown: () => {},
    onPointerMove: () => {},
}