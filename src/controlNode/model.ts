import { ControlNode } from "./controlNode";

export interface IControlsManager {
    name: string;
    init(controlNode: ControlNode): void;
}