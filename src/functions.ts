import { merge } from 'ts-deepmerge';
import { log, tag } from 'missionlog';
import type {
    BackgroundSettings,
    CenterBackgroundSettings,
    CenterSettings,
    TypedKey,
    CornerPipSettings,
    FaceType,
    Suit,
    TypeColor
} from './types';
import { Canvg } from 'canvg';

export function getClosestFactors(input: number): number[] | undefined {
    log.trace(tag.general, 'getClosestFactors(1)')
    log.trace(tag.general, input)
    log.trace(tag.general, '-------------------')
    var max = ~~Math.sqrt(input);
    // @ts-ignore
    return Array.from({length: max}, (_, i, a) => [input % (max - i), max - i])
                // @ts-ignore
                .sort((a, b) => a[0] - b[0])
                .slice(0, 1)
                // @ts-ignore
                .map(t => [Math.floor(input / t[1]), t[1]])[0];

}

export function isCenterBackgroundSettings(settings: BackgroundSettings | CenterBackgroundSettings) {
    return 'width' in settings
}

export function lowercaseFirstCharacter(string: string): string {
    if (string.length === 0) {
        return string
    }
    return string.charAt(0).toLowerCase() + string.slice(1);
}

export function mergeTypedSettings<T extends object>(object: TypedKey<T>, typeColor: TypeColor, type: Suit, faceType: FaceType): CornerPipSettings | BackgroundSettings | CenterSettings {
    var newObject = object.all
    if (Object.prototype.hasOwnProperty.call(object, faceType)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[faceType as keyof typeof object] as T) as T
    }
    if (Object.prototype.hasOwnProperty.call(object, typeColor)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[typeColor] as T) as T
    }
    if (Object.prototype.hasOwnProperty.call(object, type)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[type] as T) as T
    }
    return newObject
}

export function generateString(length: number, startWithCharacter: boolean = false): string {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers ='0123456789';
    const all = `${characters}${numbers}`;
    let result = '';
    let calcLength = length
    if (startWithCharacter === true) {
        result = characters.charAt(Math.floor(Math.random() * characters.length))
        calcLength -= 1
    }
    for (let i = 0; i < calcLength; i++) {
        result += all.charAt(Math.floor(Math.random() * all.length));
    }
    return result;
}

export async function svgToCanvas(svgText: string) {
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
    //var widthMatch = /<svg.+?(?=width=)width="(\d*)/gm
    //var heightMatch = /<svg.+?(?=height=)height="(\d*)/gm

    //var widths = [...svgText.matchAll(widthMatch)]
    //var heights = [...svgText.matchAll(heightMatch)]

    //var canvasWidth = parseFloat(widths[0][1])
    //var canvasHeight = parseFloat(heights[0][1])

    //var cardWidth = parseFloat(widths[1][1])
    //var cardHeight = heights[1][1]

    //const targetCardWidth = 1000
    //var ratio = targetCardWidth / cardWidth
    //var targetCanvasWidth = canvasWidth * ratio
    //var targetCanvasHeight = canvasHeight * ratio

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
