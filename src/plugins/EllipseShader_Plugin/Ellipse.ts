import { Color } from "../../core/Color";
import { Node } from "../../core/Node/Node";
import { SHADER_TYPE } from "../../rendering/const";
import { EllipseGeometry } from "./geometry";
import {CreateNodeOptionsType, NODE_SYSTEM_TYPE} from "../../core/Node/model";
import {RectangleGeometry} from "../../core/Geometry";

export class Ellipse extends Node<RectangleGeometry> {
    private radius: number;
    private innerRadius: number;
    private segments: number;
    private round: number;
    private start_rad: number;
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            geometry: new RectangleGeometry(),
            color: new Color({
                r: 209 / 255,
                g: 200 / 255,
                b: 150 / 255,
                a: 1,
            }),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS,
            shaderType: "ELLIPSE_SHADER"
        })
       this.size.set(100, 100)

        this.radius = 50; //this.radius = radius;
        this.innerRadius = 30; //        this.innerRadius = innerRadius;
        this.segments = 60; //        this.segments = segments;
        this.round = 100; //        this.round = round;
        this.start_rad = 0; //        this.start_rad = start_rad;

       this.geometry.updateGeometry(this.size);


        
    }
    setSize() {

    }
}