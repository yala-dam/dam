const NativePreview = require("../dam-preview/build/Release/native.node")

class DamImagePreview {
    constructor() {
        this.base64Loaded = false
        this.base64 = undefined
        this.height = undefined
        this.width = undefined
        this.mime = undefined
        this.path = undefined
    }

    async getBase64() {
        if (!this._base64Loaded) {
            await this.load()
        }
        return this.base64
    }

    async load() {
        const previewImageRaw = await NativePreview.base64(this.path, 5)
        for (let pair of previewImageRaw.split(";")) {
            const [key, data] = pair.split(":")
            this[key] = data
        }
    }
}

module.exports = DamImagePreview