const NodePath = require("path")
const NodeFs = require("fs")

const DamImageList = require("./DamImageList")

/** DamLibrary representing a DamLibrary. */
class DamLibrary {
    static get CONST() {
        return {
            BASE_FOLDERNAME: ".dam",
            PROJECTS_FOLDERNAME: "projects",
            IMAGE_TYPES: [".jpeg", ".arw", ".nef", ".png"]
        }
    };

    /**
     * @constructor
     */
    constructor() {
        this.name = ""
        this.projects = {}
        this.images = {}
        this.imageList = new DamImageList()
        this.libraryFilePath = '/Volumes/Macintosh\ HD/Users/simon/devel/damProject/dam-gui/test/.dam/'
    }

    async addImages(newImages) {
        Object.assign(this.images, newImages)
        console.log(JSON.stringify(this.images))

    }

    /**
     * 
     * @param {string} targetPath 
     */
    createLibraryFiles(targetPath) {
        let dir = NodePath.join(targetPath, DamLibrary.CONST.BASE_FOLDERNAME)
        if (!NodeFs.existsSync(dir)) {
            NodeFs.mkdirSync(dir);
        }
        dir = NodePath.join(dir, DamLibrary.CONST.PROJECTS_FOLDERNAME)
        if (!NodeFs.existsSync(dir)) {
            NodeFs.mkdirSync(dir);
        }
    }

    readLibraryData() {
        const file = NodeFs.readFileSync(NodePath.join(this.libraryFilePath, 'images.json')).toString()

    }

    writeLibraryData() {
        const json = JSON.stringify(this.images)
        const path = NodePath.normalize(NodePath.join(this.libraryFilePath, 'images.json'))
        NodeFs.writeFileSync(path, json)
    }
}

module.exports = DamLibrary