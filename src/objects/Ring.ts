import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
import {Vector2} from "../math/Vector2.ts";

export class Ring extends Object2D {
    private radius: number;
    private innerRadius: number;
    private segments: number;
    private round: number;
    private start_rad: number;
    private center: Vector2;
    constructor(center: Vector2, radius: number, innerRadius: number, segments: number, round: number, start_rad: number=0) {
        const geometry = new BufferGeometry();
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        );

        this.radius = radius;
        this.innerRadius = innerRadius;
        this.segments = segments;
        this.round = round;
        this.start_rad = start_rad;
        this.center = center;

       this._init();
    }

    _init(){
        const points = [];
        const indices = [];
        const step = (Math.PI * (this.round / 100 * 2)) / this.segments;
        //const start_rad = START_DEG * Math.PI / 180;

        for (let i = 0; i <= this.segments; i++) {
            const inc = step * i + this.start_rad;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = this.center.x + cos * this.radius;
            const pointY = this.center.y + sin * this.radius;
            const innerPointX = this.center.x + cos * this.innerRadius;
            const innerPointY = this.center.y + sin * this.innerRadius;

            points.push(pointX, pointY);
            points.push(innerPointX, innerPointY);

            const start = i * 2;
            indices.push(start, start + 1, start + 2);
            indices.push(start + 1, start + 2, start + 3);
        }

        console.log(points);
        console.log(indices);



        this.geometry.position = {
            numComponents: 2,
            data: points,
        };
        this.geometry.indices = {
            numComponents: 3,
            data: indices,
        };
    }
    getRadius() { return this.radius * this.scale.x }

    setRadius(r:number) {
        this.radius = r;
        this._init();
    }
    setSegments(s:number) {
        this.segments = s;
        this._init();
    }
    setRound(r:number) {
        this.round = r;
        this._init();
    }
    setStartRad(rad:number) {
        this.start_rad = rad;
        this._init();
    }

    // setCenter(center: Vector2){
    //     this.center = center;
    //     this._init();
    // }
}