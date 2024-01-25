import { Camera } from "./camera/Camera";
import { Vector2 } from "./math/Vector2";
import { Ellipse } from "./objects/Ellipse";
import { Mesh } from "./objects/Mesh";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Scene } from "./scene/Scene";
import {Ring} from "./objects/Ring.ts";

const rectangle = new Mesh();

// const rectangle2 = new Mesh();

const ellipse = new Ellipse(new Vector2(0,0), 100, 6, 80);
const ellipseEmpty = new Ring(100, 60, 80, 50);

//let test = 0

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
        testArr.forEach(() => {
            const R = new Mesh();
            R.setPosition(new Vector2(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)));
            this.scene.add(R);
        });
        rectangle.setPosition(new Vector2(200, 200));
        ellipse.setPosition(new Vector2(500, 200));
        ellipseEmpty.setPosition(new Vector2(750, 200));
        // ellipseEmpty.setRotation(0.2);
        // rectangle3.setPosition(new Vector2(10, 10))
        // rectangle.setScale(new Vector2(1, 1))
        // rectangle.setRotation(2)

        this.scene.add(rectangle);
        this.scene.add(ellipse);
        this.scene.add(ellipseEmpty);
        // rectangle2.add(rectangle3)
        // // console.log(rectangle2.worldMatrix)
        // // rectangle2.setRotation(1)
        this.render();

        //this.camera.setScale(10);
    }
    render(){
        const bind = this.render.bind(this)
        // rectangle2.setPosition(new Vector2(rectangle2.position.x + 1, rectangle2.position.y))
        // rectangle.setPosition(new Vector2(rectangle.position.x + 1, rectangle.position.y))
        // rectangle.setRotation(rectangle.rotation += 0.02)
        // rectangle.setScale(new Vector2(rectangle.scale.x + 0.01, rectangle.scale.y + 0.01))
        // test += 0.01


        // ellipse.setRotation(ellipse.rotation -= 0.01);
        // ellipse.setPosition(new Vector2(ellipse.position.x + 1, ellipse.position.y));
        // ellipse.setScale(new Vector2(ellipse.scale.x + 0.001, ellipse.scale.y));

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(bind);
    }
}