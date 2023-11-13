import { Float32BufferAttribute } from "../core/BufferAttribute";
import { Object2D } from "../core/Object2D";
import { Material } from "../materials/Material";

export class Mesh extends Object2D {
    geometry: any = new Float32BufferAttribute(
        [
            0, 0,
            50, 0,
            0, 50,
            0, 50,
            50, 0,
            50, 50,
        ],
        2
    )
    material: Material;
    constructor() {
        super()
        this.color = [Math.random(), Math.random(), Math.random(), 1];
        this.material = new Material(
            {
                u_color: this.color,
            },
            /* glsl */ `
                attribute vec2 a_position;

                uniform mat3 u_matrix;

                void main() {
                    vec2 XY = vec2(
                        u_matrix[0].x*a_position.x + u_matrix[1].x*a_position.y + u_matrix[2].x,
                        u_matrix[0].y*a_position.x + u_matrix[1].y*a_position.y + u_matrix[2].y
                    );
                    gl_Position = vec4(XY, 0, 1);
                }
            `,
            /* glsl */ `
                precision mediump float;

                uniform vec4 u_color;

                void main() {
                gl_FragColor = u_color;
                }
            `
        )
    }
    getWidth() { return 50 * this.scale.x }
	getHeight() { return 50 * this.scale.y}
}