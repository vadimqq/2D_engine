import {BufferGeometry} from "./BufferGeometry.ts";

export class RingGeometry extends BufferGeometry {
    public position: { numComponents: number, data: number[] } = { numComponents: 2, data: [0, 0, 50, 0, 0, 50, 50, 50] };
    public indices : { numComponents: number, data: number[] } =  { numComponents: 2, data: [0, 1, 2, 1, 2, 3, ] };
    public radius: number;
    public innerRadius: number;
    public segments: number;
    public round: number;
    public start_rad: number;
    constructor(radius: number, innerRadius: number, segments: number, round: number, start_rad: number=0) {
        super();
        this.radius = radius;
        this.innerRadius = innerRadius;
        this.segments = segments;
        this.round = round;
        this.start_rad = start_rad;
        // this.position = { numComponents: 2, data: [0, 0, 50, 0, 0, 50, 50, 50] };
        // this.indices =  { numComponents: 2, data: [0, 1, 2, 1, 2, 3, ] };

        this.update();
    }

    update(){
        const points = [];
        const indices = [];
        const step = (Math.PI * (this.round / 100 * 2)) / this.segments;
        //const start_rad = START_DEG * Math.PI / 180;

        for (let i = 0; i <= this.segments; i++) {
            const inc = step * i + this.start_rad;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = cos * this.radius;
            const pointY = sin * this.radius;
            const innerPointX = cos * this.innerRadius;
            const innerPointY = sin * this.innerRadius;

            points.push(pointX, pointY);
            points.push(innerPointX, innerPointY);

            const start = i * 2;
            indices.push(start, start + 1, start + 2);
            indices.push(start + 1, start + 2, start + 3);


        }


        this.position = {
            numComponents: 2,
            data: points,
        };
        this.indices = {
            numComponents: 2,
            data: indices,
        };

        console.log(points);
        console.log(indices);



    }
}