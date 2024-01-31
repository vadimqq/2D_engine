import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";

export interface Tool {
    onClick: (event: SpectrographMouseEvent) => void;
}