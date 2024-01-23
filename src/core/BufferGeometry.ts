interface Position {
    numComponents: number;
    data: number[]
}

interface Indices {
    numComponents: number;
    data: number[]
}

export class BufferGeometry {
    position: Position = { numComponents: 2, data: []}
    indices: Indices = { numComponents: 2, data: []}
    constructor() {}
}
