import { Object2D } from "./../core/Object2D.ts";
import {throttle} from "../decorators/throttle.ts";
import {Vector2} from "../math/Vector2.ts";


const THROTTLE_INTERSECT = 500;
const THROTTLE_CURSOR = 50;

export class RayCaster{
    canvas: HTMLCanvasElement;
    state = {
        cursor: {x: 0, y: 0},
        geometries: [] as Object2D[],
        intersections: [] as Object2D[],
    }
    subscribed:boolean; //Отладчик
    findIntersect: Function;
    setStateCursor: Function;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.subscribed = false;
        this.canvas.addEventListener('mouseover', this._subscribe.bind(this));
        this.findIntersect = throttle(this._findIntersect, THROTTLE_INTERSECT);
        this.setStateCursor = throttle(this._setStateCursor, THROTTLE_CURSOR);
    }

    _subscribe(){
        this.canvas.addEventListener('mouseout', this._unsubscribe.bind(this));
        this.canvas.addEventListener('mousemove', this.setMetrics.bind(this));
        this.subscribed = true;
    }

    _unsubscribe(){
        this.canvas.removeEventListener('mouseout', this._unsubscribe.bind(this));
        this.canvas.removeEventListener('mousemove', this.setMetrics.bind(this));
        this.subscribed = false;
        this.state.intersections = [];
    }

    setMetrics(evt:any) {
        this.setStateCursor(evt.clientX, evt.clientY);
    }
    _setStateCursor(x:number, y:number){
        this.state.cursor.x = x;
        this.state.cursor.y = y;
        console.log(this.state.cursor)
    }

    setStateGeometries(layer: any){
        // this.state.geometries = layer.parent?.children.map((item) => item.position);
        this.state.geometries = layer.parent?.children;
    }
    getState() {
        return this.state;
    }

    getCursor() {
        return this.state.cursor;
    }
    getIntersections() {
        return this.state.intersections;
    }

    _pairElements(arr:number[]): number[][]{
        const result = [];
        for (let i = 0; i < arr.length; i += 2) {
            result.push([arr[i], arr[i + 1]]);
        }
        return result;
    }

    _setIntersect() {}
    _findIntersect(layer: Object2D){

        this.setStateGeometries(layer);

        if(!this.subscribed) return;

        console.log(this.state.intersections);

        this.state.intersections = [];
        this.state.intersections = this.state.geometries.reduce((acc: Object2D[], item) => {
            const width = item.getWidth();
            const heigth = item.getHeight();
            //вычисляем середину фигуры, + размер / 2 >> сравнивая с положением курсора
            const isIntersectX = ((item.position.x - width / 2) <= this.state.cursor.x) && ((item.position.x + width / 2) >= this.state.cursor.x);
            const isIntersectY = ((item.position.y - heigth / 2) <= this.state.cursor.y) && ((item.position.y + heigth / 2) >= this.state.cursor.y);

            if(isIntersectX && isIntersectY){
                acc.push(item);
            }

            // const intersect = (() => {
            //     let positions = this._pairElements(item.geometry.position.data);
            //     for (let [x, y] of positions){
            //
            //     }
            //     return positions;
            // })();
            // console.log(intersect);
            return acc.reverse();
        }, []);
    }

}