// import * as Materialize from 'materialize-css'
// import 'materialize-css/dist/js/materialize.min.js'
console.log('yay')

import $ from "jquery";
import * as M from 'materialize-css'
import { SVG, Path, Svg, Rect, Text, Polygon } from '@svgdotjs/svg.js'

import * as standardPipLocations from './pipLocations/standard.json'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';
import {
    CardSettings,
    CornerPipLocation,
    XY,
    PipType,
    CornerPipPath,
    CornerPipSettings,
    PipLocationName,
    BackgroundSettings,
    CenterBackgroundSettings,
    CenterPipLayout,
    CenterPipSettings,
    RotatableXY,
    TypeColor,
    HexColor
} from "./types";
import merge from "ts-deepmerge";

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

var testSettings: CardSettings = {
    outlineAffectsPosition: true,
    background: {
        all: {
            enabled: true,
            outline: {
                enabled: false,
                width: 10
            },
            color: "#FFF",
            radius: 12,
        },
        heart: {
            enabled: true,
            outline: {
                enabled: true,
                width: 10
            },
            color: "#000",
            radius: 12,
        }
    },
    defaultColors: {
        club: '#000',
        spade: '#000',
        heart: '#F00',
        diamond: '#F00',
        red: '#F00',
        black: '#000',
        all: '#000'
    },
    center: {
        all: {
            background: {
                enabled: false,
                outline: {
                    enabled: true,
                    color: '#00F',
                    width: 2
                },
                color: "#FFD47F",
                width: 150,
                height: 200,
                paddingX: 50,
                paddingY: 75,
                radius: 5,
            },
            pips: {
                enabled: true,
                width: 50,
                location: PipLocationName.Standard,
                locationScale: 1
            }
        },
        club: {
            background: {
                enabled: true,
                outline: {
                    enabled: true,
                    color: '#00F',
                    width: 2
                },
                color: "#FFD47F",
                width: 150,
                height: 200,
                paddingX: 50,
                paddingY: 75,
                radius: 5,
            },
            pips: {
                enabled: true,
                width: 25,
                location: PipLocationName.Standard,
                locationScale: 0.5
            }
        }
    },
    cornerPips: [
        {
            all: {
                enabled: true,
                location: CornerPipLocation.TopLeft,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 21.5,
                    centerPadX: true
                },
                pip: {
                    enabled: true,
                    width: 23,
                    height: 30,
                    paddingY: 50,
                    paddingX: 10,
                }
            },
            club: {
                enabled: true,
                location: CornerPipLocation.TopLeft,
                character: {
                    enabled: true,
                    fontSize: 25
                },
                pip: {
                    enabled: true,
                    height: 25,
                }
            }
        },
        {
            all: {
                enabled: true,
                location: CornerPipLocation.BottomRight,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 21.5,
                    centerPadX: true
                },
                pip: {
                    enabled: true,
                    width: 23,
                    height: 30,
                    paddingY: 50,
                    paddingX: 10,
                }
            },
            club: {
                enabled: true,
                location: CornerPipLocation.BottomRight,
                character: {
                    enabled: true,
                    fontSize: 25
                },
                pip: {
                    enabled: true,
                    height: 25,
                }
            }
        },
        {
            all: {
                enabled: false,
                location: CornerPipLocation.TopRight,
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
            }
        },
        {
            all: {
                enabled: false,
                location: CornerPipLocation.BottomLeft,
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
        }
    ]
}

const pipOptions = {
    'club': [
        'm 30,150 c 5,235 55,250 100,350 H -130 C -85,400 -35,385 -30,150 a 10,10 0 0 0 -20,0 210,210 0 1 1 -74,-201 10,10 0 0 0 14,-14 230,230 0 1 1 220,0 10,10 0 0 0 14,14 210,210 0 1 1 -74,201 10,10 0 0 0 -20,0 z'
    ],
    'spade': [
        'M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z'
    ],
    'heart': [
        'M0 -300C0 -400 100 -500 200 -500C300 -500 400 -400 400 -250C400 0 0 400 0 500C0 400 -400 0 -400 -250C-400 -400 -300 -500 -200 -500C-100 -500 0 -400 -0 -300Z'
    ],
    'diamond': [
        'M -400,0 C -350,0 0,-450 0,-500 0,-450 350,0 400,0 350,0 0,450 0,500 0,450 -350,0 -400,0 Z'
    ]
}

const pipLocations: CenterPipLayout[] = [
    standardPipLocations
]

const cardSize: XY = {
    x: 250,
    y: 350
}

$(() => {
    M.Collapsible.init($('.collapsible'), {});
    // var draw = SVG().addTo('#example-card').size(`${cardSize.x}px`, `${cardSize.y}px`)

    var test = SVG().addTo('#test').size(`${cardSize.x}px`, `${cardSize.y}px`)
    test.rect(cardSize.x, cardSize.y).fill('#FFF').move(0, 0)
    var pip = test.path(pipOptions.club[0])
    pip.fill('#000')
    pip.size(50)
    pip.move(100, 50)
    var w = pip.bbox().w
    var h = pip.bbox().h

    // var rect = test.rect(w * 2, h * 2).move(100 - (w + (w / 2)), 50 - (h / 2)).fill({ color: '#FFF' })
    // rect.rotate(-45, 100 + (w / 2), 50 + (h / 2))
    
    // var jagged = createJaggedEdge(test, w * 2, h * 2, w / 10, 6).move(100 - (w + (w / 2)) + (w / 20), 50 - (h / 2)).fill('#FFF')
    // jagged.rotate(0, 100 + (w / 2), 50 + (h / 2))

    var spiked = createSpikedEdge(test, w * 2, h * 2, w / 10, 6).move(100 - (w + (w / 2) - (w / 20)), 50 - (h / 2)).fill('#FFF')
    spiked.rotate(45, 100 + (w / 2), 50 + (h / 2))
    
    var mask = test.mask()

    mask.add(spiked)
    
    pip.maskWith(mask)

    var edge = createSpikedEdge(test, w * 2, h * 2, w / 10, 6).move(100 - (w + (w / 2)), 50 - (h / 2)).fill('#FFF')

    edge.fill('#000')
    edge.move(100, 150)

    function createJaggedEdge(canvas: Svg, width: number, height: number, spikeDepth: number, spikes: number): Polygon {
        var points = `0,${height} 0,0 ${width},0`
        var interval = height / spikes
        for (var i = 0; i < spikes; i++) {
            points += ` ${width - spikeDepth},${(i * interval)}`
            points += ` ${width},${(i * interval) + interval}`
        }
        var polygon = canvas.polygon(points)
        return polygon
    }

    function createSpikedEdge(canvas: Svg, width: number, height: number, spikeDepth: number, spikes: number): Polygon {
        var points = `0,${height} 0,0 ${width},0`
        var halfStep = height / ((spikes * 2) + 1)
        var wholeStep = halfStep * 2
        for (var i = 0; i < spikes + 1; i++) {
            points += ` ${width},${(i * wholeStep)}`
            points += ` ${width - spikeDepth},${(i * wholeStep) + halfStep}`
            if (i !== spikes) {
                points += ` ${width},${((i + 1) * wholeStep)}`
            }
        }
        var polygon = canvas.polygon(points)
        return polygon
    }

    var dupePip = pip.clone()
    test.add(dupePip)
    dupePip.rotate(180, 100 + (w / 2), 50 + (h / 2))

    var characters = ['A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    var suits = {'c': 'club', 's': 'spade', 'h': 'heart', 'd': 'diamond'}

    var cards: CardSvg[] = []

    for (var character of characters) {
        for (const [suitCharacter, suit] of Object.entries(suits)) {
            //var draw = SVG().addTo(`#${suitCharacter}${character.toLowerCase()}`).size(`${cardSize.x}px`, `${cardSize.y}px`)
            var draw = SVG().addTo(`#all`).size(`${cardSize.x}px`, `${cardSize.y}px`)
            var card = new CardSvg(draw, testSettings, suit as PipType, character)
            card.drawCard()
            cards.push(card)
        }
    }
    // var card = new CardSvg(draw, testSettings, 'spade', '0')
})

class CardSvg {

    private canvas: Svg;
    private settings: CardSettings;
    private cardSize: XY;

    private type: PipType;
    private typeIndex: number;
    private character: string;

    private cardBackground: Rect | undefined;
    private centerBackground: Rect | undefined;
    private cornerPips: CornerPipPath[];
    private centerPips: Path[];

    constructor(canvas: Svg, settings: CardSettings, type: PipType, character: string, typeIndex?: number, cardSize?: XY) {
        log.trace(tag.cardClass, 'constructor()')
        this.canvas = canvas
        this.settings = settings
        this.cardSize = cardSize || {
            x: this.canvas.rbox().w,
            y: this.canvas.rbox().h
        }
        this.cornerPips = []
        this.centerPips = []
        this.type = type
        this.typeIndex = typeIndex ?? 0
        this.character = character
    }

    get defaultColor(): HexColor {
        log.trace(tag.cardClass, 'get defaultColor()')
        return this.settings.defaultColors[this.type] ?? this.settings.defaultColors[this.typeColor] ?? this.settings.defaultColors.all
    }

    get typeColor(): TypeColor {
        switch (this.type) {
            case 'club':
            case 'spade':
                return 'black'
            case 'heart':
            case 'diamond':
                return 'red'
            default:
                return 'all'
        }
    }

    get centerPipName(): string {
        log.trace(tag.cardClass, 'get centerPipName()')
        if (this.character.toLowerCase() === 'a') {
            return '1'
        }
        return this.character.toLowerCase()
    }

    public drawCard(): Svg {
        log.trace(tag.cardClass, 'drawCard()')
        this.drawCardBackground()
        this.drawCornerPips()
        this.drawCenterBackground()
        this.drawCenterPips()
        return this.canvas
    }

    private drawCornerPips(): Svg {
        log.trace(tag.cardClass, 'drawCornerPips()')
        if (this.cornerPips.length != this.settings.cornerPips.length) {
            this.resetCornerPips()
        }
        if (this.cornerPips.length === 0) {
            for (var cornerPipSettings of this.settings.cornerPips) {
                this.cornerPips.push(this.processCornerPip(merge(cornerPipSettings.all, cornerPipSettings[this.typeColor] ?? cornerPipSettings.all, cornerPipSettings[this.type] ?? cornerPipSettings.all)))
            }
        } else {
            var replacementPips: CornerPipPath[] = []
            for (const [index, cornerPip] of this.cornerPips.entries()) {
                const cornerPipSettings = this.settings.cornerPips[index]
                const cornerPipSettingsMerged = merge(cornerPipSettings.all, cornerPipSettings[this.typeColor] ?? cornerPipSettings.all, cornerPipSettings[this.type] ?? cornerPipSettings.all)
                replacementPips.push(this.processCornerPip(cornerPipSettingsMerged, cornerPip))
            }
            this.cornerPips = replacementPips
        }
        return this.canvas
    }

    private processCornerPip(cornerPipSettings: CornerPipSettings, paths?: CornerPipPath): CornerPipPath {
        log.trace(tag.cardClass, 'processCornerPip(2)')
        log.trace(tag.cardClass, cornerPipSettings)
        log.trace(tag.cardClass, paths)
        log.trace(tag.cardClass, '-------------------')
        if (!cornerPipSettings.enabled) {
            return {}
        }
        var cornerPip: Path | undefined = paths?.pip;
        var cornerCharacter: Text | undefined = paths?.character;
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
            cornerPip.fill(pipSettings.color ?? cornerPipSettings.color ?? this.defaultColor)
            cornerPip.size(pipSettings.width, pipSettings.height)
            cornerPip = this.positionCornerItem(
                cornerPip,
                cornerPipSettings.location,
                pipSettings.paddingX,
                pipSettings.paddingY,
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
                anchor: 'middle'
            })
            cornerCharacter.fill(characterSettings.color ?? cornerPipSettings.color ?? this.defaultColor)
            cornerCharacter = this.positionCornerItem(
                cornerCharacter,
                cornerPipSettings.location,
                characterSettings.paddingX,
                characterSettings.paddingY,
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

    private positionCornerItem(
        item: Path | Text,
        location: CornerPipLocation,
        xPad?: number,
        yPad?: number,
        outlineAffectsPosition?: boolean,
        centerPadX?: boolean,
        centerPadY?: boolean): Path | Text {
        log.trace(tag.cardClass, 'positionCornerItem(7)')
        log.trace(tag.cardClass, item)
        log.trace(tag.cardClass, xPad)
        log.trace(tag.cardClass, yPad)
        log.trace(tag.cardClass, location)
        log.trace(tag.cardClass, outlineAffectsPosition)
        log.trace(tag.cardClass, centerPadX)
        log.trace(tag.cardClass, centerPadY)
        log.trace(tag.cardClass, '-------------------')
        const xCenterAdjust = centerPadX ?? false ? (item.bbox().w / 2) : 0
        const yCenterAdjust = centerPadY ?? false ? (item.bbox().h / 2) : 0
        const backgroundSettings = this.settings.background === undefined ? undefined : merge(this.settings.background.all, this.settings.background[this.typeColor] ?? this.settings.background.all, this.settings.background[this.type] ?? this.settings.background.all)
        const outlineAdjust = outlineAffectsPosition ?? false ? backgroundSettings?.outline?.enabled ?? false ? backgroundSettings?.outline?.width ?? 0 : 0 : 0
        const xVal = (xPad ?? 0) - xCenterAdjust + outlineAdjust
        const yVal = (yPad ?? 0) - yCenterAdjust + outlineAdjust
        if (location < CornerPipLocation.TopRight) {
            // Top Left - Bottom Right
            item.move(xVal, yVal)
        } else {
            // Top Right - Bottom Left
            item.move(this.canvas.rbox().w - item.bbox().w - xVal, yVal)
        }
        if (location == CornerPipLocation.BottomLeft || location == CornerPipLocation.BottomRight) {
            item.rotate(180, this.cardSize.x / 2, this.cardSize.y / 2)
        }
        return item
    }

    private resetCornerPips(): Svg {
        log.trace(tag.cardClass, 'resetCornerPips()')
        for (var cornerPip of this.cornerPips) {
            cornerPip.character?.remove()
            cornerPip.pip?.remove()
        }
        this.cornerPips = []
        return this.canvas
    }

    private drawCardBackground(): Svg {
        log.trace(tag.cardClass, 'drawCardBackground()')
        if (this.cardBackground === undefined) {
            this.cardBackground = this.canvas.rect(this.cardSize.x, this.cardSize.y)
        }
        const backgroundSettings = this.settings.background === undefined ? undefined : merge(this.settings.background.all, this.settings.background[this.typeColor] ?? this.settings.background.all, this.settings.background[this.type] ?? this.settings.background.all)
        if (backgroundSettings !== undefined && backgroundSettings.enabled) {
            this.moveBackground(this.cardBackground, backgroundSettings)
        } else {
            this.cardBackground.remove()
            this.cardBackground = undefined
        }
        return this.canvas
    }

    private drawCenterBackground(): Svg {
        log.trace(tag.cardClass, 'drawBackground()')
        var centerBackgroundSettings = merge(this.settings.center.all, this.settings.center[this.typeColor] ?? this.settings.center.all, this.settings.center[this.type] ?? this.settings.center.all).background
        if (this.centerBackground === undefined) {
            this.centerBackground = this.canvas.rect(centerBackgroundSettings?.width ?? 0, centerBackgroundSettings?.height ?? 0)
        }
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.enabled) {
            this.moveBackground(this.centerBackground, centerBackgroundSettings)
        } else {
            this.centerBackground.remove()
            this.centerBackground = undefined
        }
        return this.canvas
    }

    private moveBackground(background: Rect, settings: BackgroundSettings | CenterBackgroundSettings): Svg {
        log.trace(tag.cardClass, 'moveBackground()')
        const paddingX = isCenterBackgroundSettings(settings) ? (settings as CenterBackgroundSettings).paddingX ?? 0 : 0
        const paddingY = isCenterBackgroundSettings(settings) ? (settings as CenterBackgroundSettings).paddingY ?? 0 : 0
        const width = isCenterBackgroundSettings(settings) ? (settings as CenterBackgroundSettings).width ?? 0 : this.cardSize.x
        const height = isCenterBackgroundSettings(settings) ? (settings as CenterBackgroundSettings).height ?? 0 : this.cardSize.y
        background.move(paddingX, paddingY)
        background.fill(settings.color)
        if (settings.outline !== undefined && settings.outline.enabled) {
            const outlineSettings = settings.outline
            const outlineAdjust = outlineSettings.width / 2
            background.remove()
            background = this.canvas.rect(width - outlineSettings.width, height - outlineSettings.width)
            background.move(paddingX + outlineAdjust, paddingY + outlineAdjust)
            background.fill(settings.color)
            background.stroke({
                color: outlineSettings.color ?? this.defaultColor,
                width: outlineSettings.width,
                opacity: outlineSettings.opacity,
                linecap: outlineSettings.lineCap,
                dasharray: outlineSettings.dashArray,
                dashoffset: outlineSettings.dashOffset
            })
        }
        background.radius(settings.radius ?? 0)
        return this.canvas
    }

    private drawCenterPips(): Svg {
        log.trace(tag.cardClass, 'drawCenterPips()')
        const centerSettings = merge(this.settings.center.all, this.settings.center[this.typeColor] ?? this.settings.center.all, this.settings.center[this.type] ?? this.settings.center.all)
        if (centerSettings.pips !== undefined && centerSettings.pips.enabled) {
            const centerPipSettings = centerSettings.pips
            const pipLocationSelection = pipLocations[centerSettings.pips.location]
            const pipLocationsList = pipLocationSelection[this.centerPipName] ?? []
            if (this.centerPips.length != pipLocationsList.length) {
                this.resetCenterPips()
            }
            if (this.centerPips.length === 0) {
                for (var pipLocationItem of pipLocationsList) {
                    this.centerPips.push(this.processCenterPip(
                        centerPipSettings,
                        pipLocationItem
                    ))
                }
            } else {
                var replacementPips: Path[] = []
                for (const [index, centerPip] of this.centerPips.entries()) {
                    replacementPips.push(this.processCenterPip(
                        centerPipSettings,
                        pipLocationsList[index],
                        centerPip
                    ))
                }
                this.centerPips = replacementPips
            }
        }
        return this.canvas
    }

    private processCenterPip(centerPipSettings: CenterPipSettings, location: RotatableXY, pip?: Path): Path {
        log.trace(tag.cardClass, 'processCenterPip(3)')
        log.trace(tag.cardClass, centerPipSettings)
        log.trace(tag.cardClass, location)
        log.trace(tag.cardClass, pip)
        log.trace(tag.cardClass, '-------------------')
        try {
            var chosenPath = pipOptions[this.type][this.typeIndex]
        } catch (e) {
            log.warn(tag.user, 'Chosen index too far, using 0')
            chosenPath = pipOptions[this.type][0]
        }
        if (pip === undefined) {
            log.trace(tag.cardClass, 'pip undefined')
            pip = this.canvas.path(chosenPath)
        }
        pip.fill(centerPipSettings.color ?? this.defaultColor)
        pip.size(centerPipSettings.width, centerPipSettings.height)
        const zeroX = this.cardSize.x / 2
        const zeroY = this.cardSize.y / 2
        const locationXScaled = location.x * centerPipSettings.locationScale
        const locationYScaled = location.y * centerPipSettings.locationScale
        const widthAdjust = pip.bbox().w / 2
        const heightAdjust = pip.bbox().h / 2
        pip.move(zeroX + locationXScaled - widthAdjust, zeroY + locationYScaled - heightAdjust)
        pip.rotate(location.rotation ?? 0)
        return pip
    }

    private resetCenterPips(): Svg {
        log.trace(tag.cardClass, 'resetCenterPips()')
        for (var centerPip of this.centerPips) {
            centerPip.remove()
        }
        this.centerPips = []
        return this.canvas
    }

}

function isCenterBackgroundSettings(settings: BackgroundSettings | CenterBackgroundSettings) {
    return 'width' in settings
}
