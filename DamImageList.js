
class DamImageList {
    constructor(images) {
        this.images = images
        this.uuidTable = {}
        if (images) {
            this.updateUuidTable()
        }
    }

    iterableImageList() {
        const uuids = Object.keys(this.uuidTable)
        const getImageByUuid = (uuid) => {
            return this.getImageByUuid(uuid)
        }
        return {
            [Symbol.iterator]() {
                let index = 0
                const iterator = {
                    next: () => {
                        if (index >= uuids.length) {
                            return {
                                value: undefined,
                                done: true
                            }
                        }
                        const uuid = uuids[index]
                        const image = getImageByUuid(uuid)
                        index += 1
                        return {
                            value: image,
                            done: false
                        }
                    }
                }
                return iterator
            }
        }
    }

    updateUuidTable() {
        const tbl = {}
        function rec(data, pth = [], createUuidTableUpperBound = 100000) {
            if (createUuidTableUpperBound <= 0) {
                throw new Error("HIT updateUuidTableUpperBound")
            }
            for (let index in data) {
                const thatPth = pth.slice()
                thatPth.push(index)
                if (data[index].constructor.name == "DamImage") {
                    //tbl[data[index].uuid] = thatPth.join("/")
                    tbl[data[index].uuid] = data[index]
                    continue
                }
                rec(data[index], thatPth, --createUuidTableUpperBound)
            }
        }
        rec(this.images)
        this.uuidTable = tbl
    }

    getByPath(pth) {
        const parts = pth.split("/")
        function rec(data, part, getByPathUpperBound = 10000) {
            if (getByPathUpperBound <= 0) {
                throw new Error("HIT getByPathUpperBound")
            }
            const curIndex = part.shift()
            const curData = data[curIndex]
            if (part.length <= 0) {
                return curData
            }
            return rec(curData, part, --getByPathUpperBound)
        }
        return rec(this.images, parts)
    }

    getImageByUuid(uuid) {
        return this.uuidTable[uuid]
    }
}

module.exports = DamImageList