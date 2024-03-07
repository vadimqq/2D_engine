import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";

export interface Tool {
    onClick?: (event: SpectrographMouseEvent) => void;
    onPointerDown?: (event: SpectrographMouseEvent) => void;
    onPointerMove?: (event: SpectrographMouseEvent) => void;
    onPointerUp?: (event: SpectrographMouseEvent) => void;
}