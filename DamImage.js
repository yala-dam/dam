const DamImagePreview = require("./DamImagePreview")

/** DamImage  representing a DamImage . */
class DamImage {
    constructor() {
        this.file = undefined
        this.path = undefined
        this.hash = undefined
        this.preview = new DamImagePreview(this.path)
    }

    /**
     * 
     * @param {string} pth 
     */
    setPath(pth) {
        this.path = pth
        this.preview.path = pth
        this.hash = Buffer.from(pth, 'utf8').toString('hex')
    }

    async getPreview() {
        if (!this.preview._base64Loaded) {
            await this.preview.load()
        }
        return this.preview
    }
}

module.exports = DamImage