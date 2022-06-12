import {createXXHash64} from 'hash-wasm';
//import xxhash from 'xxhash-wasm';

export default class HashCalculation {
    constructor(setMax, setNow, callbackFile, nowFile, chunkSize) {
        if (chunkSize === undefined) {
            chunkSize = 1.28e+8
        }
        this.callbackFile = callbackFile;
        this.nowFile = nowFile;
        this.setProgressMax = setMax;
        this.setProgressNow = setNow;
        this.chunkSize = chunkSize //bytes
        this.hashWorker = undefined
        this.listFiles = []
        this.nowChunk = 0;
        this.fileReader = new FileReader()

    }

    async createWorker() {
        //TODO selectors type of hash
        // const {create64} = await xxhash();
        // this.hashWorker = create64
        const hash_obj = await createXXHash64()
        this.hashWorker = hash_obj

    }

    readUint8Array(blobObj) {
        const fileReader = this.fileReader;
        const setNow = this.setProgressNow
        const beforeBytes = this.chunkSize * this.nowChunk
        return new Promise((resolve) => {
                fileReader.onprogress = function (event) {
                    setNow(beforeBytes + event.loaded)
                }
                fileReader.onload = function () {
                    resolve(new Uint8Array(fileReader.result))
                }
                fileReader.readAsArrayBuffer(blobObj)
            }
        )
    }

    addFile(fileObj) {
        this.listFiles.push(fileObj);
    }

    setFiles(listFiles) {
        this.listFiles = listFiles;
    }

    sliceFile(FileObj) {

        let listSlice = []

        const count = Math.round(FileObj.size / this.chunkSize) + 1
        for (let i = 0; i < count; i++) {
            const start = i * this.chunkSize
            let end = start + this.chunkSize
            if (end > FileObj.size) {
                end = FileObj.size
            }
            listSlice.push(FileObj.slice(start, end))
        }
        return listSlice
    }

    async calcHash(fileObj) {
        const listBlob = this.sliceFile(fileObj)
        //const localWorker = this.hashWorker()
        const localWorker = this.hashWorker.init()
        let uint8Array = []
        for (const [i, blob] of listBlob.entries()) {
            this.nowChunk = i
            uint8Array = await this.readUint8Array(blob)
            localWorker.update(uint8Array)
        }

        return localWorker.digest().toString(16)
    }

    async startHashCalculation() {
        const staticListFiles = this.listFiles.concat()
        let fileHash = "";
        for (let file of staticListFiles) {
            const start = new Date()
            this.setProgressMax(file.size)
            this.nowFile(file)
            fileHash = await this.calcHash(file)
            this.setProgressNow(file.size)
            this.callbackFile(file, fileHash, (new Date() - start) / 1000)

        }
    }


}