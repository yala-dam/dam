const NodePath = require("path")
const NodeFs = require("fs")

const DamImage = require("./DamImage")
const DamLibrary = require("./DamLibrary")

/**
 * 
 * @param {array<string>} dirPaths 
 * @param {function} onFileFound 
 */
const scanDirForDamImages = async (dirPaths, onFileFound) => {
    if (!(dirPaths instanceof Array)) {
        dirPaths = [dirPaths]
    }
    const r = {}
    if (onFileFound == undefined) {
        onFileFound = () => { }
    }
    async function bla(path, depth = 0) {
        const b = {}
        const res = await readdirAsync(path, { encoding: "utf8", withFileTypes: true })
        for (let e of res) {
            if (e.isDirectory()) {
                const ret = await bla(NodePath.join(path, e.name), depth + 1)
                if (!(Object.keys(ret).length === 0 && ret.constructor === Object)) {
                    b[e.name] = ret
                }
            }
            if (e.isFile() && !e.name.startsWith(".")) {
                if (DamLibrary.CONST.IMAGE_TYPES.includes((NodePath.extname(e.name).toLowerCase()))) {
                    const newImage = new DamImage(NodePath.join(path, e.name))
                    newImage.file = e
                    newImage.setPath(NodePath.join(path, e.name))
                    newImage.uuid = uniqueID()
                    b[e.name] = newImage
                    await onFileFound(newImage)
                }
            }
        }
        return b
    }
    for (let dirPath of dirPaths) {
        r[NodePath.basename(dirPath)] = await bla(dirPath)
    }
    return r
}

function uniqueID() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() + chr4() + chr4();
}

function readdirAsync(path, options) {
    return new Promise((res, rej) => {
        NodeFs.readdir(path, options, (err, files) => {
            if (err) {
                rej(err)
            }
            res(files)
        })
    })
}


module.exports = {
    uniqueID,
    scanDirForDamImages,
    readdirAsync
}