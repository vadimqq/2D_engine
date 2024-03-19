import { ActionsType } from "../model"

export const graphicsActions: ActionsType = {
    onPointerDown: ({event, controlNode, intersect, setCurrentIntersectionNode}) => {
        if (event.shiftKey) {
            controlNode.addNode(intersect)
            setCurrentIntersectionNode(controlNode)
        } else {
            controlNode.clearNodeList()
            controlNode.addNode(intersect)
            setCurrentIntersectionNode(controlNode)
        }
    },
    onPointerUp: () => {},
    onPointerMove: () => {},
    onDrag: () => {},
    onDragEnd: () => {},
}