import { cursorGetter } from "../cursorGetter"
import { ActionsType, CURSOR_TYPE } from "../model"

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
    onPointerMove: ({ cursorStyleManager }) => {
        cursorStyleManager.setCursor(CURSOR_TYPE.DEFAULT, cursorGetter.getDefaultCursor())
    },
    onDrag: () => {},
    onDragEnd: () => {},
}