import { cursorGetter } from "../cursorGetter"
import { ActionsType, CURSOR_TYPE } from "../model"

export const sceneActions: ActionsType = {
    onPointerDown: ({controlNode}) => {
        controlNode.clearNodeList()
    },
    onPointerUp: () => {},
    onPointerMove: ({ cursorStyleManager }) => {
        cursorStyleManager.setCursor(CURSOR_TYPE.DEFAULT, cursorGetter.getDefaultCursor())
    },
    onDrag: () => {},
    onDragEnd: () => {},
}