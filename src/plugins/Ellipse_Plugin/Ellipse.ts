import { Color } from "../../core/Color";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { SHADER_TYPE } from "../../rendering/const";
import { EllipseGeometry } from "./geometry";

export class Ellipse extends Node<EllipseGeometry> {
    private radius: number;
    private innerRadius: number;
    private segments: number;
    private round: number;
    private start_rad: number;
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            geometry: new EllipseGeometry(),
            color: new Color({
                r: 109 / 255,
                g: 200 / 255,
                b: 150 / 255,
                a: 1,
            }),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS,
            shaderType: SHADER_TYPE.PRIMITIVE
        })
       this.size.set(100, 100)

        this.radius = 50; //this.radius = radius;
        this.innerRadius = 30; //        this.innerRadius = innerRadius;
        this.segments = 60; //        this.segments = segments;
        this.round = 100; //        this.round = round;
        this.start_rad = 0; //        this.start_rad = start_rad;

       this.geometry.updateGeometry(
            this.radius,
            this.innerRadius,
            this.segments,
            this.round,
            this.start_rad,
            this.size
       )


        
    }
    setSize() {

    }
}