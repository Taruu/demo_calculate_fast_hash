//import xxhash from "xxhash-wasm";
import {createXXHash64} from 'hash-wasm';

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
        // const {create64} = await xxhash();
        // this.hashWorker = create64;
        this.hashWorker = createXXHash64
        console.log(this.hashWorker)
        return
    }

    readUint8Array(blobObj) {
        //atom-amd64.deb
        // File hash: f2cf4d5cd0ac0743
        // File size: 118.43 MB Time: 0.514s.
        //atom-amd64.deb
        // File hash: ef46db3751d8e999
        // File size: 118.43 MB Time: 0.377s.
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
        let start = 0
        const count = Math.round(FileObj.size / this.chunkSize) + 1
        for (let i = 0; i < count; i++) {
            start = i * this.chunkSize
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
        let hasher = await this.hashWorker()
        hasher.init()
        let uint8Array = []
        for (const [i, blob] of listBlob.entries()) {
            this.nowChunk = i
            uint8Array = await this.readUint8Array(blob)
            hasher.update(uint8Array)
        }

        return hasher.digest().toString(16)
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