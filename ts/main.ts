import $ from "jquery";
import * as M from '@materializecss/materialize'
import { SVG } from '@svgdotjs/svg.js'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';
import {
    CardSettings,
    XY,
    PipType,
    PipCharacterCombo
} from "./types";
import { CardGrid } from "./classes/CardGrid";
import { CardSvg } from "./classes/CardSvg";
import { Canvg } from 'canvg';
import { cardSize as cardSizeBase } from './constants';

import * as standardConfig from '../configs/test/crazy.json'
import bootstrap from "bootstrap";
// import { init } from "./configEditor";
import { ToastFunctions as Toast } from './toasts';

const logger = {
    [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
    [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
    [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.greenBright(tag)}]`, msg, ...params),
    [LogLevel.TRACE]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
    [LogLevel.DEBUG]: (tag, msg, params) => console.log(`[${chalk.magenta(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

log.init({ cardClass: 'card_class', gridClass: 'grid_class', general: 'general' }, (level, tag, msg, params) => {
    logger[level as keyof typeof logger](tag, msg, params);
});

var testSettings: CardSettings = standardConfig as CardSettings

var cardSize: XY = {
    x: 1000,
    y: 1400
}

cardSize = cardSizeBase

interface CardStorage {
    [key: string]: CardSvg
}

function download(filename, text) {
    var element = document.createElement('a');
    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('href', `data:image/png;base64,${text}`);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function dataURLtoBlob(dataurl) {
    log.trace(tag.general, 'dataURLtoBlob(1)')
    log.trace(tag.general, dataurl)
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

async function downloadCanvas(svgText) {
    log.trace(tag.general, 'downloadCanvas(1)')
    var link = document.createElement("a");
    log.trace(tag.general, link)
    var canvas = await svgToCanvas(svgText)
    log.trace(tag.general, canvas)
    var imgData = canvas.toDataURL('image/png');
    // var strDataURI = imgData.substring(22, imgData.length);
    var blob = dataURLtoBlob(imgData);
    var objurl = URL.createObjectURL(blob);

    link.download = "helloWorld.png";

    link.href = objurl;

     link.click();
}

async function svgToCanvas(svgText) {
    log.trace(tag.general, 'svgToCanvas(1)')
    const canvas = document.createElement('canvas');
    log.trace(tag.general, canvas)
    if (canvas === null) {
        throw new Error('canvas null')
    }
    const ctx = canvas.getContext('2d');
    log.trace(tag.general, ctx)
    if (ctx === null) {
        throw new Error('ctx null')
    }
    log.trace(tag.general, svgText)
    var widthMatch = /<svg.+?(?=width=)width="(\d*)/gm
    var heightMatch = /<svg.+?(?=height=)height="(\d*)/gm

    var widths = [...svgText.matchAll(widthMatch)]
    var heights = [...svgText.matchAll(heightMatch)]

    var canvasWidth = widths[0][1]
    var canvasHeight = heights[0][1]

    var cardWidth = widths[1][1]
    var cardHeight = heights[1][1]

    const targetCardWidth = 1000
    var ratio = targetCardWidth / cardWidth
    var targetCanvasWidth = canvasWidth * ratio
    var targetCanvasHeight = canvasHeight * ratio

    //log.trace(tag.general, [...svgText.matchAll(widthMatch)])
    //log.trace(tag.general, [...svgText.matchAll(heightMatch)])

    //var width = parseInt(svgText.match(widthMatch)[1])
    //var height = parseInt(svgText.match(heightMatch)[1])



    var v = await Canvg.from(ctx, svgText);//, { scaleWidth: 5000, scaleHeight: 5000 });
    log.trace(tag.general, v)

    // v.resize(5000, 5000, 'xMidYMid slice')

    // Render only first frame?
    v.render()

    // Start SVG rendering with animations and mouse handling.
    // v.start();
    return canvas
}

async function svgToPng(svgText): Promise<string> {
    const canvas = await svgToCanvas(svgText)
    var data = canvas.toDataURL('image/png')
    // document.body.removeChild(canvas)
    return data
    /*
    // convert an svg text to png using the browser
    return new Promise(function (resolve, reject) {
        try {
            // can use the domUrl function from the browser
            var domUrl = window.URL || window.webkitURL || window;
            if (!domUrl) {
                throw new Error("(browser doesnt support this)")
            }

            // figure out the height and width from svg text
            var match = svgText.match(/height=\"(\d+)/m);
            var height = match && match[1] ? parseInt(match[1], 10) : 200;
            var match = svgText.match(/width=\"(\d+)/m);
            var width = match && match[1] ? parseInt(match[1], 10) : 200;

            // it needs a namespace
            if (!svgText.match(/xmlns=\"/mi)) {
                svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
            }

            // create a canvas element to pass through
            var canvas = document.createElement("canvas");
            canvas.width = height;
            canvas.height = width;
            var ctx = canvas.getContext("2d");
            // make a blob from the svg
            var svg = new Blob([svgText], {
                type: "image/svg+xml;charset=utf-8"
            });

            // create a dom object for that image
            var url = domUrl.createObjectURL(svg);

            // create a new image to hold it the converted type
            var img = new Image;

            // when the image is loaded we can get it as base64 url
            img.onload = function() {
                // draw it to the canvas
                if (ctx === null) {
                    return reject(new Error('ctx null'))
                }
                ctx.drawImage(this, 0, 0);
                // we don't need the original any more
                domUrl.revokeObjectURL(url);
                // now we can resolve the promise, passing the base64 url
                resolve(canvas.toDataURL());
            };

            // load the image
            img.src = url;

        } catch (err) {
            reject('failed to convert svg to png ' + err);
        }
    });
    */
};

function dataURIToBlob(dataURI, filename, callback) {
    var binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    callback(filename, new Blob([arr]));
}

var callback = function (filename, blob) {
    var a = document.createElement('a');
    a.download = filename;
    a.innerHTML = 'download';
    // the string representation of the object URL will be small enough to workaround the browser's limitations
    a.href = URL.createObjectURL(blob);
    // you must revoke the object URL, 
    //   but since we can't know when the download occured, we have to attach it on the click handler..
    a.onclick = function () {
        // ..and to wait a frame
        requestAnimationFrame(function () {
            URL.revokeObjectURL(a.href);
        });
        a.removeAttribute('href')
    };
    a.click()
};

$(() => {

    const triggerTabList = document.querySelectorAll('#config-tabs button')
        triggerTabList.forEach(triggerEl => {
        const tabTrigger = new bootstrap.Tab(triggerEl)

        triggerEl.addEventListener('click', event => {
            event.preventDefault()
            tabTrigger.show()
        })
    })
    /*
    var collapsible = $('.collapsible')
    if (collapsible !== undefined && collapsible !== null && collapsible.length > 0) {
        M.Collapsible.init(collapsible[0], {});
    }
    var tabs = $('.tabs')
    if (tabs !== undefined && tabs !== null && tabs.length > 0) {
        console.log(M);
        console.log(M.Tabs);
        M.Tabs.init(tabs[0], {});
    }
*/
    // init();
    $('#json-config').val(JSON.stringify(testSettings, null, 4))
    /*
    M.Forms.textareaAutoResize($('#json-config')[0] as HTMLTextAreaElement);

    M.FormSelect.init($('select')[0] as HTMLSelectElement, {});
    */

    var all = SVG().addTo('#all')
    var grid = new CardGrid(all, undefined, [], cardSize, [10, 6])
    var drawn = false

    $('#json-config-submit').on('click', (event) => {
        event.preventDefault()
        log.trace(tag.general, 'json-config-submit')
        log.trace(tag.general, $('#character-select').val())
        log.trace(tag.general, $('#suit-select').val())

        var order: PipCharacterCombo[] = []
        for (const character of <string[]>$('#character-select').val()) {
            for (const suit of <string[]>$('#suit-select').val()) {
                order.push({
                    pip: suit as PipType,
                    character: character
                })
            }
        }
        grid.setOrder(order, [10, 6])
        try {
            var settings = <CardSettings>JSON.parse(<string>$('#json-config').val())
            grid.setSettings(settings)
            grid.resetCards()
            grid.redrawCards()
            Toast.info('Test');
        } catch (e) {
            log.error(tag.general, e)
            Toast.danger('Error', 'Error redrawing cards, check json');
            // new M.Toast({ text: 'Error redrawing cards, check json', classes: 'rounded red white-text' });
            return
        }
        drawn = true
    })

    $('#cards-download').on('click', (event) => {
        event.preventDefault()
        log.trace(tag.general, 'cards-download')
        if (drawn) {
            /*
            var svg = grid.export()
            download('test.svg', svg)
            *

            svgToPng(grid.export('svg')).then((data) => {
                log.trace(tag.general, data)
                // download('test.png', data)
                // dataURIToBlob(data, 'test.png', callback);
                downloadCanvas(data)
            }).catch((e) => {
                log.error(tag.general, 'svgToPng catch')
                log.error(tag.general, e)
                M.toast({ html: 'Unknown error', classes: 'rounded red white-text' });
            })*/

            downloadCanvas(grid.export('svg')).then((data) => {
                log.trace(tag.general, data)
                // download('test.png', data)
                // dataURIToBlob(data, 'test.png', callback);
            }).catch((e) => {
                log.error(tag.general, 'svgToPng catch')
                log.error(tag.general, e)
                Toast.danger('Error', 'Unknown error');
                //new M.Toast({ text: 'Unknown error', classes: 'rounded red white-text' });
            })
        } else {
            Toast.danger('Error', 'Make sure cards are drawn first');
            //new M.Toast({ text: 'Make sure cards are drawn first', classes: 'rounded red white-text' });
        }
    })
})
