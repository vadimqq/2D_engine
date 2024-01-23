import { Camera } from "./camera/Camera";
import { Vector2 } from "./math/Vector2";
import { Ellipse } from "./objects/Ellipse";
import { Mesh } from "./objects/Mesh";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Scene } from "./scene/Scene";

// const rectangle = new Mesh();

const rectangle2 = new Mesh();

const ellipse = new Ellipse({ radius: 50, innerRadius: 20, segment: 100, length: Math.PI * 2, startPosition: 0});

let test = 0

const testArr = Array.from(Array(0).keys())

export class Spectrograph {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    constructor(){
        this.renderer = new WebGLRenderer()
        this.scene = new Scene();
        this.camera = new Camera();
    }
    init() {
        testArr.forEach(element => {
            const R = new Mesh();
            R.setPosition(new Vector2(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)))
            this.scene.add(R)
        });
        // rectangle.setPosition(new Vector2(100, 100))
        ellipse.setPosition(new Vector2(100, 100))
        // rectangle3.setPosition(new Vector2(10, 10))
        // // rectangle.setScale(new Vector2(1, 1))
        // // rectangle.setRotation(2)

        // this.scene.add(rectangle)
        this.scene.add(ellipse)
        // rectangle2.add(rectangle3)
        // // console.log(rectangle2.worldMatrix)
        // // rectangle2.setRotation(1)
        this.render()

        this.camera.setScale(1)

    }
    render(){
        const bind = this.render.bind(this)
        // rectangle2.setPosition(new Vector2(rectangle2.position.x + 1, rectangle2.position.y))
        // rectangle.setPosition(new Vector2(rectangle.position.x + 1, rectangle.position.y))

        // rectangle.setRotation(test)
        // test += 0.01
        // rectangle.setScale(new Vector2(rectangle.scale.x + 0.01, rectangle.scale.y))

        this.renderer.render(this.scene, this.camera)
        // ellipse.setLength(ellipse.options.length + Math.PI / 1000)
	    requestAnimationFrame(bind);
    }
}
