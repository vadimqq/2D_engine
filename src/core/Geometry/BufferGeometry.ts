export class BufferGeometry {
    position = { numComponents: 2, data: [0, 0, 50, 0, 0, 50, 50, 50], };
    indices =  { numComponents: 2, data: [0, 1, 2, 1, 2, 3, ]};
    constructor() {
    }

    updateGeometry(...args: any) {}
}