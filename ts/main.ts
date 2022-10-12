// import * as Materialize from 'materialize-css'
// import 'materialize-css/dist/js/materialize.min.js'
console.log('yay')

import $ from "jquery";
import * as M from 'materialize-css'
import { SVG, Path, Svg, Rect, Text } from '@svgdotjs/svg.js'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';

const logger = {
    [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
    [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
    [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.greenBright(tag)}]`, msg, ...params),
    [LogLevel.TRACE]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
    [LogLevel.DEBUG]: (tag, msg, params) => console.log(`[${chalk.magenta(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

log.init({ cardClass: 'card_class', user: 'user' }, (level, tag, msg, params) => {
    logger[level as keyof typeof logger](tag, msg, params);
});

type HexColor = `#${string}`;

interface CornerPipSubSettings extends CornerPipSubSettingsBase {
    width: number
    height?: number
}

interface CornerPipCharacterSettings extends CornerPipSubSettingsBase {
    fontSize: number
    font?: string
}

interface CornerPipSubSettingsBase {
    enabled: boolean
    paddingY: number
    paddingX: number
    centerPad?: boolean
    centerPadX?: boolean
    centerPadY?: boolean
    outlineAffectsPosition?: boolean
    color?: HexColor
}

type PipType = 'club' | 'spade' | 'heart' | 'diamond'
type LineCap = 'butt' | 'round' | 'square'

enum CornerPipLocation {
    TopLeft = 0,
    BottomRight = 1,
    TopRight = 2,
    BottomLeft = 3
}

interface CornerPipSettings {
    enabled: boolean
    location: CornerPipLocation
    character?: CornerPipCharacterSettings
    outlineAffectsPosition?: boolean
    pip?: CornerPipSubSettings
    color?: HexColor
}

interface DefaultColors {
    club?: HexColor
    spade?: HexColor
    heart?: HexColor
    diamond?: HexColor
    red?: HexColor
    black?: HexColor
    default: HexColor
}

interface OutlineSettings {
    enabled: boolean
    color?: HexColor
    opacity?: number
    lineCap?: LineCap
    dashArray?: string
    dashOffset?: number
    width: number
}

interface BackgroundSettings {
    outline?: OutlineSettings
    color: HexColor
}

interface CardSettings {
    outlineAffectsPosition?: boolean
    radius?: number
    background: BackgroundSettings
    defaultColors: DefaultColors
    cornerPips: CornerPipSettings[]
}

interface XY {
    x: number,
    y: number
}

var testSettings: CardSettings = {
    outlineAffectsPosition: true,
    radius: 12,
    background: {
        outline: {
            enabled: true,
            width: 10
        },
        color: "#FFF",
    },
    defaultColors: {
        club: '#000',
        spade: '#000',
        heart: '#F00',
        diamond: '#F00',
        red: '#F00',
        black: '#000',
        default: '#000'
    },
    cornerPips: [
        {
            enabled: true,
            location: CornerPipLocation.TopLeft,
            character: {
                enabled: true,
                fontSize: 25,
                paddingY: 10,
                paddingX: 22.5,
                centerPadX: true,
                color: '#0F0'
            },
            pip: {
                enabled: true,
                width: 25,
                paddingY: 50,
                paddingX: 10,
            }
        },
        {
            enabled: true,
            location: CornerPipLocation.BottomRight,
            character: {
                enabled: true,
                fontSize: 25,
                paddingY: 10,
                paddingX: 22.5,
                centerPadX: true
            },
            pip: {
                enabled: true,
                width: 25,
                paddingY: 50,
                paddingX: 10,
            }
        }
    ]
}

const pipOptions = {
    'club': [
        'm 30,150 c 5,235 55,250 100,350 H -130 C -85,400 -35,385 -30,150 a 10,10 0 0 0 -20,0 210,210 0 1 1 -74,-201 10,10 0 0 0 14,-14 230,230 0 1 1 220,0 10,10 0 0 0 14,14 210,210 0 1 1 -74,201 10,10 0 0 0 -20,0 z'
    ]
}

const cardSize: XY = {
    x: 250,
    y: 350
}

$(() => {
    M.Collapsible.init($('.collapsible'), {});

    var draw = SVG().addTo('#example-card').size(`${cardSize.x}px`, `${cardSize.y}px`)

    var card = new CardSvg(draw, testSettings, 'club', '10')
    card.drawCard()

    // var cardBackground = draw.rect(cardSize.x, cardSize.y)
    // cardBackground.move(0, 0)
    // cardBackground.fill(testSettings.backgroundColor)
    // cardBackground.radius(testSettings.radius)
    // 
    // var path = draw.path(clubsOptions[0])
    // path.fill('#000000')//.move(0, 0)
    // // Rotate point xy is absolute
    // //path.rotate(180, 125, 175)//, 125 + (125 / 2), 175 + (125 / 2))
    // //path.move(125 - (125 / 2), 175 - (125 / 2))
    // //path.move(10, 20)
    // path.size(25, 25)
    // path = positionPip(path, testSettings.topLeftCorner?.pip?.paddingX ?? 0, testSettings.topLeftCorner?.pip?.paddingY ?? 0, CornerPipType.TopLeft)
    //console.log(path.transform())
    //path.transform({
        //rotate: 0,
        //translateX: 50,
        //translateY: 50,
        //scale: 10
    //})
    //path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })

    // console.log(clubsSvg)
    // var svg = draw.svg(clubsSvgPath)
    // svg.transform({
    //     rotate: 0,
    //     translateX: 50,
    //     translateY: 50,
    //     scale: 0.1
    // })
    //var rect = draw.rect(100, 100).attr({ fill: '#f06' })
})

interface CornerPipPaths {
    character?: Text,
    pip?: Path
}

class CardSvg {

    private canvas: Svg;
    private settings: CardSettings;
    private cardSize: XY;

    private type: PipType;
    private typeIndex: number;
    private character: string;

    private cardBackground: Rect;
    private cornerPips: CornerPipPaths[];

    constructor(canvas: Svg, settings: CardSettings, type: PipType, character: string, typeIndex?: number, cardSize?: XY) {
        log.trace(tag.cardClass, 'constructor')
        this.canvas = canvas
        this.settings = settings
        this.cardSize = cardSize || {
            x: this.canvas.rbox().w,
            y: this.canvas.rbox().h
        }
        this.cornerPips = []
        this.type = type
        this.typeIndex = typeIndex ?? 0
        this.character = character
        // console.log(this.canvas.width())
        // console.log(this.canvas.height())
        // console.log(this.canvas.viewbox())
        // console.log(this.canvas.svg())
        // console.log(this.canvas.rbox())
        // console.log(this.canvas.css())
        // console.log(this.canvas.attr())
        // console.log(this.canvas.viewbox())
        // console.log(this.canvas.bbox())
        // console.log(this.cardSize)
    }

    public drawCard(): Svg {
        log.trace(tag.cardClass, 'drawCard')
        this.drawBackground()
        this.drawCornerPips()
        return this.canvas
    }

    private drawCornerPips(): Svg {
        log.trace(tag.cardClass, 'drawCornerPips')
        if (this.cornerPips.length != this.settings.cornerPips.length) {
            this.resetCornerPips()
        }
        if (this.cornerPips.length === 0) {
            for (var cornerPipSettings of this.settings.cornerPips) {
                this.cornerPips.push(this.processCornerPip(cornerPipSettings))
            }
        } else {
            var replacementPips: CornerPipPaths[] = []
            for (const [index, cornerPip] of this.cornerPips.entries()) {
                replacementPips.push(this.processCornerPip(this.settings.cornerPips[index], cornerPip))
            }
            this.cornerPips = replacementPips
        }
        return this.canvas
    }

    private processCornerPip(cornerPipSettings: CornerPipSettings, paths?: CornerPipPaths): CornerPipPaths {
        log.trace(tag.cardClass, 'processCornerPip 2 params')
        log.trace(tag.cardClass, cornerPipSettings)
        log.trace(tag.cardClass, paths)
        log.trace(tag.cardClass, false ?? true)
        if (!cornerPipSettings.enabled) {
            return {}
        }
        var cornerPip: Path | undefined = paths?.pip;
        var cornerCharacter: Text | undefined = paths?.character;
        var defaultColor = this.settings.defaultColors[this.type]
        if (defaultColor === undefined) {
            switch (this.type) {
                case 'club':
                case 'spade':
                    defaultColor = this.settings.defaultColors['black']
                case 'heart':
                case 'diamond':
                    defaultColor = this.settings.defaultColors['red']
                default:
                    defaultColor = this.settings.defaultColors.default
            }
            defaultColor = defaultColor ?? this.settings.defaultColors.default
        }
        if (cornerPipSettings.pip !== undefined && cornerPipSettings.pip.enabled) {
            log.trace(tag.cardClass, 'cornerPipSettings.pip not undefined')
            const pipSettings = cornerPipSettings.pip
            try {
                var chosenPath = pipOptions[this.type][this.typeIndex]
            } catch (e) {
                log.warn(tag.user, 'Chosen index too far, using 0')
                chosenPath = pipOptions[this.type][0]
            }
            if (cornerPip === undefined) {
                log.trace(tag.cardClass, 'cornerPip undefined')
                cornerPip = this.canvas.path(chosenPath)
            }
            cornerPip.fill(pipSettings.color ?? cornerPipSettings.color ?? defaultColor)
            cornerPip.size(pipSettings.width, pipSettings.height)
            cornerPip = this.positionCornerItem(
                cornerPip,
                pipSettings.paddingX,
                pipSettings.paddingY,
                cornerPipSettings.location,
                pipSettings.outlineAffectsPosition ?? cornerPipSettings.outlineAffectsPosition ?? this.settings.outlineAffectsPosition,
                pipSettings.centerPadX ?? pipSettings.centerPad,
                pipSettings.centerPadY ?? pipSettings.centerPad
            ) as Path
        } else {
            cornerPip = undefined
        }
        if (cornerPipSettings.character !== undefined && cornerPipSettings.character.enabled) {
            log.trace(tag.cardClass, 'cornerPipSettings.character not undefined')
            const characterSettings = cornerPipSettings.character
            if (cornerCharacter === undefined) {
                log.trace(tag.cardClass, 'cornerPip undefined')
                cornerCharacter = this.canvas.text(this.character)
            }
            cornerCharacter.build(false)
            cornerCharacter.plain(this.character)
            cornerCharacter.font({
                family: characterSettings.font ?? 'Helvetica',
                size: characterSettings.fontSize,
                anchor: 'middle',
                // leading: '1.5em'
            })
            cornerCharacter.fill(characterSettings.color ?? cornerPipSettings.color ?? defaultColor)
            //cornerCharacter.size(characterSettings.width, characterSettings.height)
            cornerCharacter = this.positionCornerItem(
                cornerCharacter,
                characterSettings.paddingX,
                characterSettings.paddingY,
                cornerPipSettings.location,
                characterSettings.outlineAffectsPosition ?? cornerPipSettings.outlineAffectsPosition ?? this.settings.outlineAffectsPosition,
                characterSettings.centerPadX ?? characterSettings.centerPad,
                characterSettings.centerPadY ?? characterSettings.centerPad
            ) as Text
        } else {
            cornerPip = undefined
        }
        return {
            character: cornerCharacter,
            pip: cornerPip
        }
    }

    private positionCornerItem(item: Path | Text, xPad: number, yPad: number, location: CornerPipLocation, outlineAffectsPosition?: boolean, centerPadX?: boolean, centerPadY?: boolean): Path | Text {
        const xCenterAdjust = centerPadX ?? false ? (item.bbox().w / 2) : 0
        const yCenterAdjust = centerPadY ?? false ? (item.bbox().h / 2) : 0
        const outlineAdjust = outlineAffectsPosition ?? false ? this.settings.background.outline?.width ?? 0 : 0
        if (location < CornerPipLocation.TopRight) {
            // Top Left - Bottom Right
            item.move(xPad - xCenterAdjust + outlineAdjust, yPad - yCenterAdjust + outlineAdjust)
            //pipObject.
            console.log(item.bbox())
            if (location == CornerPipLocation.BottomRight) {
                item.rotate(180, this.cardSize.x / 2, this.cardSize.y / 2)
            }
        } else {
            // Top Right - Bottom Left
        }
        return item
    }

    private resetCornerPips(): Svg {
        log.trace(tag.cardClass, 'resetCornerPips')
        for (var cornerPip of this.cornerPips) {
            cornerPip.character?.remove()
            cornerPip.pip?.remove()
        }
        this.cornerPips = []
        return this.canvas
    }

    private drawBackground(): Svg {
        log.trace(tag.cardClass, 'drawBackground')
        if (this.cardBackground === undefined) {
            this.cardBackground = this.canvas.rect(this.cardSize.x, this.cardSize.y)
        }
        this.cardBackground.move(0, 0)
        this.cardBackground.fill(this.settings.background.color)
        if (this.settings.background.outline !== undefined && this.settings.background.outline.enabled) {
            const outlineSettings = this.settings.background.outline
            const outlineAdjust = outlineSettings.width / 2
            this.cardBackground.remove()
            this.cardBackground = this.canvas.rect(this.cardSize.x - outlineSettings.width, this.cardSize.y - outlineSettings.width)
            this.cardBackground.move(outlineAdjust, outlineAdjust)
            this.cardBackground.fill(this.settings.background.color)
            this.cardBackground.stroke({
                color: outlineSettings.color ?? this.settings.defaultColors.default,
                width: outlineSettings.width,
                opacity: outlineSettings.opacity,
                linecap: outlineSettings.lineCap,
                dasharray: outlineSettings.dashArray,
                dashoffset: outlineSettings.dashOffset
            })
        }
        this.cardBackground.radius(this.settings.radius ?? 0)
        return this.canvas
    }

}
