import { Control } from "../../../controlNode/Control";
import { RESIZE_CONTROLS_NAME, RESIZE_SIDE_CONTROLS_NAME, ROTATE_CONTROLS_NAME } from "../../BaseControls_Plugin";
import { ActionsType } from "../model";
import { resizeControlActions } from "./controlActions/resizeControlActions";
import { resizeSideControlActions } from "./controlActions/resizeSideControlActions";
import { rotateControlActions } from "./controlActions/rotateControlActions";

const actionMapper: {[key: string]: ActionsType} = {
    [RESIZE_CONTROLS_NAME]: resizeControlActions,
    [RESIZE_SIDE_CONTROLS_NAME]: resizeSideControlActions,
    [ROTATE_CONTROLS_NAME]: rotateControlActions,
}
export const controlActions: ActionsType = {
    onDrag: (options) => {
        const control = options.intersect as Control;
        if (actionMapper[control.controlManagerName]) {
            actionMapper[control.controlManagerName].onDrag(options);
        }
    },
    onDragEnd: (options) => {
        const control = options.intersect as Control;
        if (actionMapper[control.controlManagerName]) {
            actionMapper[control.controlManagerName].onDragEnd(options);
        }
    },
    onPointerUp: (options) => {
        const control = options.intersect as Control;
        if (actionMapper[control.controlManagerName]) {
            actionMapper[control.controlManagerName].onPointerUp(options);
        }
    },
    onPointerDown: (options) => {
        const control = options.intersect as Control;
        if (actionMapper[control.controlManagerName]) {
            actionMapper[control.controlManagerName].onPointerDown(options);
        }
    },
    onPointerMove: (options) => {
        const control = options.intersect as Control;
        if (actionMapper[control.controlManagerName]) {
            actionMapper[control.controlManagerName].onPointerMove(options);
        }
    },
}