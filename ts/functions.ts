import merge from 'ts-deepmerge';
import { log, tag } from 'missionlog';
import { BackgroundSettings, CenterBackgroundSettings, CenterSettings, TypedKey, CornerPipSettings, FaceType, PipType, TypeColor } from './types';

export function getClosestFactors(input: number): number[] {
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

export function mergeTypedSettings(object: TypedKey<CornerPipSettings> | TypedKey<BackgroundSettings> | TypedKey<CenterSettings>, typeColor: TypeColor, type: PipType, faceType: FaceType): CornerPipSettings | BackgroundSettings | CenterSettings {
    var newObject = object.all
    if (Object.prototype.hasOwnProperty.call(object, faceType)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[faceType] as TypedKey<CornerPipSettings> | TypedKey<BackgroundSettings> | TypedKey<CenterSettings>)
    }
    if (Object.prototype.hasOwnProperty.call(object, typeColor)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[typeColor] as TypedKey<CornerPipSettings> | TypedKey<BackgroundSettings> | TypedKey<CenterSettings>)
    }
    if (Object.prototype.hasOwnProperty.call(object, type)) {
        newObject = merge.withOptions(
            { mergeArrays: false },
            newObject,
            object[type] as TypedKey<CornerPipSettings> | TypedKey<BackgroundSettings> | TypedKey<CenterSettings>)
    }
    return newObject
}

export function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}