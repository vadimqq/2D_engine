import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Color } from "../core/Color";
import { Node } from "../core/Node/Node";

export class Scene extends Node<BufferGeometry> {
    type = 'Scene';
    backgroundColor = null;
    constructor(){
        const geometry = new BufferGeometry()
        const color = new Color({r: 0, g: 0, b: 0, a:1})
        super(geometry, color);
        this.size.set(1000, 1000)
    }
}