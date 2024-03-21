import { ActionsType } from "../model";

export const controlNodeActions: ActionsType & { isPointerDownCalled: boolean } = {
    isPointerDownCalled: false,
    onDrag: ({controlNode, event, startMousePosition}) => {
        controlNode.setPosition(event.scenePosition.sub(startMousePosition).round().applyMatrix3(controlNode.inverseWorldMatrix))
    },
    onDragEnd: ({controlNode}) => {
        controlNode.endNodeMutation()
    },
    onPointerUp: ({event, controlNode}) => {
        if (controlNodeActions.isPointerDownCalled) {
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
        }
        controlNodeActions.isPointerDownCalled = false;
    },
    onPointerDown: () => {
        controlNodeActions.isPointerDownCalled = true;
    },
    onPointerMove: () => {},
}