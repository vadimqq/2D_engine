import EventEmitter from "eventemitter3";
// import test from './TestWorker';

export class StreamManager extends EventEmitter {
    streamsMap = new Map<string, Worker>()
    constructor() {
        super()
        const worker = new Worker('./src/core/StreamManager/TestWorker.ts')
        this.streamsMap.set('COLLISION', worker)

        this.getCollisionStream = this.getCollisionStream.bind(this);
    }
    registerNewStream() {}
    destroyStream() {}
    getCollisionStream(): Worker {
        return this.streamsMap.get('COLLISION') as Worker
    }
}