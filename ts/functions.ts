import { log, tag } from 'missionlog';
import { BackgroundSettings, CenterBackgroundSettings } from './types';

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