const cheerio = require('cheerio')
const fs = require('fs');

const svgDirectory = `${__dirname}/svg`
const jsonDirectory = `${__dirname}/json`

var paths = {}
var files = fs.readdirSync(svgDirectory)

var promises = []

files.forEach(filename => {
    var nameSplit = filename.split('.')[0].split('-')
    var read = readFilePromise(`${svgDirectory}/${filename}`)
    read.catch((error) => {
        console.error(error)
    })
    read.then((data) => {
        const $ = cheerio.load(data, { xml: true })
        for (var i = 0; i <= 20; i++) {
            var path = $(`path[inkscape\\:label="layer-${i}"]`)
            if (path.length > 0) {
                if (paths[nameSplit[0]] === undefined) {
                    paths[nameSplit[0]] = {}
                }
                if (paths[nameSplit[0]][nameSplit[1]] === undefined) {
                    paths[nameSplit[0]][nameSplit[1]] = {}
                }
                if (i === 0 && path[0].attribs.d !== undefined) {
                    paths[nameSplit[0]][nameSplit[1]]['rotate'] = {
                        type: 'fill',
                        width: 0,
                        path: path[0].attribs.d
                    }
                } else {
                    var strokeWidth = 1
                    var strokeWidthString = Object.prototype.hasOwnProperty.call(path[0].attribs, 'stroke-width') ? path[0].attribs['stroke-width'] : '1'
                    try {
                        strokeWidth = parseFloat(strokeWidthString)
                    } catch (e) {
                        console.warn(`Error most likely parsing float: ${strokeWidthString}`)
                        strokeWidth = 1
                    }
                    var pathInfo = {
                        type: Object.prototype.hasOwnProperty.call(path[0].attribs, 'stroke') ? 'stroke' : 'fill',
                        width: strokeWidth,
                        path: path[0].attribs.d ?? ''
                    }
                    paths[nameSplit[0]][nameSplit[1]][i] = pathInfo ?? {}
                }
            }
        }
    })
    promises.push(read)
})

Promise.all(promises).then(() => {
    fs.mkdir(jsonDirectory, (error) => {
        if (error && error.code !== 'EEXIST') {
            console.error('error')
            console.error(error)
        } else {
            fs.writeFile(`${jsonDirectory}/honorCards.json`, JSON.stringify(paths), (error) => {
                if (error) {
                    console.error(error)
                }
                console.log('Saved')
            })
        }
    })
});

function readFilePromise(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, function (error, data) {
            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
