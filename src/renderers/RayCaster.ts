import { Object2D } from "./../core/Object2D.ts";

export class RayCaster{
    canvas: HTMLCanvasElement;
    state = {
        cursor: {x: 0, y: 0},
        geometries: [],
    }
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener('mouseover', this._subscribe.bind(this));
    }

    _subscribe(){
        this.canvas.addEventListener('mouseout', this._unsubscribe.bind(this));
        this.canvas.addEventListener('mousemove', this.getMetrics.bind(this));
    }

    _unsubscribe(){
        this.canvas.removeEventListener('mouseout', this._unsubscribe.bind(this));
        this.canvas.removeEventListener('mousemove', this.getMetrics.bind(this));
    }

    getMetrics(evt:any) {
        // console.log(getComputedStyle(evt.target));
        console.log(this.canvas.getContext("webgl2"));
        this.setState('cursor', evt.clientX, evt.clientY);
    }
    setState(obj:any, x:number, y:number){
        this.state[obj].x = x;
        this.state[obj].y = y;
    }
    getState() {
        return this.state;
    }
    findIntersect(layer: Object2D){
        //layer
        console.log(layer)
    }
}