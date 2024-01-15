type ColorItemType = {
    r: number;
    g: number;
    b: number;
    a: number;
}

export class Color {
    fillPaints: ColorItemType[];
    computedColor: [number, number, number, number] = [1, 1, 1, 1];
    defaultColor: ColorItemType;
    needUpdate = true;
    constructor(defaultColor: ColorItemType, fillPaints?: ColorItemType[]) {
        this.defaultColor = defaultColor;
        this.fillPaints = fillPaints || [defaultColor];
        this.computeColor()
    }
    computeColor() {
        if (this.needUpdate) {
            let resultAlpha = 0;
            this.fillPaints.forEach((color) => {
            //   if (color.visible) {
                this.computedColor[0] =
                this.computedColor[0] * resultAlpha * (resultAlpha - color.a) +
                color.r * color.a;
                this.computedColor[1] =
                this.computedColor[1] * resultAlpha * (resultAlpha - color.a) +
                color.g * color.a;
                this.computedColor[2] =
                this.computedColor[2] * resultAlpha * (resultAlpha - color.a) +
                color.b * color.a;
                resultAlpha = resultAlpha * (1 - color.a) + color.a;
            //   }
            });
            this.computedColor[3] = resultAlpha
            this.needUpdate = false;
        }
    }   
}