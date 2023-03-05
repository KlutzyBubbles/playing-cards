var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
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
                    paths[nameSplit[0]][nameSplit[1]]['rotate'] = path[0].attribs.d
                } else {
                    paths[nameSplit[0]][nameSplit[1]][i] = path[0].attribs.d ?? ''
                }
            }
        }
    })
    promises.push(read)
})

Promise.all(promises).then(() => {
    // console.log(paths)
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
