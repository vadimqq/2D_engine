export class CursorStyleManager {
    canvas: HTMLCanvasElement;
    currentCursorType: string;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    setCursor(type: string, cursor: string) {
        // if (this.currentCursorType !== type) {
            this.canvas.style.cursor = cursor;
        //     this.currentCursorType = type;
        // }
    }
}