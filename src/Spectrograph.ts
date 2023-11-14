import { Camera } from "./camera/Camera";
import { Vector2 } from "./math/Vector2";
import { Mesh } from "./objects/Mesh";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Scene } from "./scene/Scene";

const rectangle = new Mesh();

const rectangle2 = new Mesh();

const rectangle3 = new Mesh();

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
        rectangle.setPosition(new Vector2(100, 100))
        // rectangle2.setPosition(new Vector2(40, 40))
        // rectangle3.setPosition(new Vector2(10, 10))
        // // rectangle.setScale(new Vector2(1, 1))
        // // rectangle.setRotation(2)

        this.scene.add(rectangle)
        // rectangle.add(rectangle2)
        // rectangle2.add(rectangle3)
        // // console.log(rectangle2.worldMatrix)
        // // rectangle2.setRotation(1)
        this.render()

        this.camera.setScale(1)

    }
    render(){
        const bind = this.render.bind(this)
        // rectangle.setPosition(new Vector2(rectangle.position.x + 1, rectangle.position.y))

        rectangle.setRotation(test)
        test += 0.05
        // rectangle.setScale(new Vector2(rectangle.scale.x + 0.01, rectangle.scale.y))

        this.renderer.render(this.scene, this.camera)
	    requestAnimationFrame(bind);
    }
}
