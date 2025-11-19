import { Path, Svg, Rect, Text, Polygon } from '@svgdotjs/svg.js'

import { log, tag } from 'missionlog';
import type {
    CardSettings,
    XY,
    CornerPipPath,
    CornerPipSettings,
    BackgroundSettings,
    CenterBackgroundSettings,
    CenterPipSettings,
    RotatableXY,
    TypeColor,
    HexColor,
    FaceType,
    CenterSettings,
    Scale,
    CornerPipLocation,
    Suit,
    Character,
    ImageFormat
} from "../types";
import {
    CornerPipLocationEnum, CornerPipLocations, ImageFormatEnum
} from '../types';
import { pipLocations, pipOptions, faceLayouts, cardSize as cardSizeBase } from '../constants';
import { isCenterBackgroundSettings, mergeTypedSettings, svgToCanvas } from '../functions';

export class CardSvg {

    public canvas: Svg;
    private settings: CardSettings;
    private cardSize: XY;
    private scale: Scale;

    private type: Suit;
    private typeIndex: number;
    private character: Character;

    private cardBackground: Rect | undefined;
    private centerBackground: Rect | undefined;
    private centerBackgroundClip: Rect | undefined;
    private cardBackgroundBorder: Rect | undefined;
    private centerBackgroundBorder: Rect | undefined;
    private cornerPips: (Partial<Record<CornerPipLocation, CornerPipPath>> | undefined);
    private centerPips: (Path | Svg)[];
    // private faces: G[];

    constructor(canvas: Svg, settings: CardSettings, type: Suit, character: Character, typeIndex?: number, cardSize?: XY) {
        log.trace(tag.cardClass, 'constructor()')
        this.canvas = canvas
        this.settings = settings
        this.cardSize = cardSize || {
            x: this.canvas.rbox().w,
            y: this.canvas.rbox().h
        }
        this.scale = {
            width: this.cardSize.x / cardSizeBase.x,
            height: this.cardSize.y / cardSizeBase.y
        }
        this.cornerPips = {}
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

    get pipName(): string {
        log.trace(tag.cardClass, 'get centerPipName()')
        if (this.character.toLowerCase() === 'a') {
            return '1'
        }
        return this.character.toLowerCase()
    }

    get pipPath(): string {
        try {
            var chosenPath = pipOptions[this.type][this.typeIndex]
        } catch (e) {
            log.warn(tag.user, 'Chosen index too far, using 0')
            chosenPath = pipOptions[this.type][0]
        }
        return chosenPath
    }

    get faceType(): FaceType {
        const values = ['a', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
        const faces = ['j', 'q', 'k']
        if (values.includes(this.character.toLowerCase())) {
            return 'value'
        } else if (faces.includes(this.character.toLowerCase())) {
            return 'face'
        }
        return 'unknown'
    }

    get svgText(): string {
        const parent = this.canvas.parent();
        if (parent !== null) {
            this.canvas.flatten(parent, undefined);
        }
        return `<svg width="${this.canvas.width()}px" height="${this.canvas.height()}px">>${this.canvas.defs().svg()}${this.canvas.svg()}</svg>`;
    }

    public async export(format: ImageFormat): Promise<string | undefined> {
        if (format === ImageFormatEnum.SVG) {
            return this.svgText;
        } else {
            var canvas = await svgToCanvas(this.svgText);
            if (format === ImageFormatEnum.PNG) {
                return canvas.toDataURL('image/png');
            } else {
                return canvas.toDataURL('image/jpeg');
            }
        }
    }

    public drawCard(): Svg {
        log.trace(tag.cardClass, 'drawCard()')
        this.drawCardBackground()
        this.drawCardBackgroundBorder()
        this.drawCornerPips()
        this.drawCenterBackgroundClip()
        this.drawCenterBackground()
        this.drawFaceCards()
        this.drawCenterBackgroundBorder()
        this.drawCenterPips()
        return this.canvas
    }

    private scaled(width: number, height: number): { width: number, height: number };
    private scaled(width: number, height: number | undefined): { width: number, height: number | undefined };
    private scaled(width: number | undefined, height: number): { width: number | undefined, height: number };
    private scaled(width: number | undefined, height: number | undefined): { width: number | undefined, height: number | undefined };

    private scaled(width?: number, height?: number): { width: number | undefined, height: number | undefined } {
        return {
            width: width === undefined ? undefined : width * (this.scale.width ?? 1),
            height: height === undefined ? undefined : height * (this.scale.height ?? 1)
        }
    }

    private scaleSingle(item: number): number;
    private scaleSingle(item: number | undefined): number | undefined;

    private scaleSingle(item?: number): number | undefined {
        if (item === undefined) {
            return undefined;
        }
        return item === undefined ? undefined : item * ((this.scale.width ?? 1) > (this.scale.height ?? 1) ? (this.scale.height ?? 1) : (this.scale.width ?? 1))
    }

    private drawCornerPips(): Svg {
        log.trace(tag.cardClass, 'drawCornerPips()')
        var pipList: Record<CornerPipLocation, (CornerPipSettings | undefined)> = {
            [CornerPipLocationEnum.TopLeft]: undefined,
            [CornerPipLocationEnum.BottomRight]: undefined,
            [CornerPipLocationEnum.TopRight]: undefined,
            [CornerPipLocationEnum.BottomLeft]: undefined
        }
        for (const pipLocationName of CornerPipLocations) {
            const cornerPipSettings = this.settings.cornerPips[pipLocationName];
            if (cornerPipSettings !== undefined) {
                pipList[pipLocationName] = mergeTypedSettings(cornerPipSettings, this.typeColor, this.type, this.faceType) as CornerPipSettings;
            }
        }
        // if (this.cornerPips.length != cornerPipCount) {
            this.resetCornerPips()
        // }
        if (this.cornerPips === undefined) {
            this.cornerPips = {};
        }
        if (Object.keys(this.cornerPips).length === 0) {
            for (var [key, cornerPipSettings] of Object.entries(pipList)) {
                if (cornerPipSettings !== undefined) {
                    this.cornerPips[key as keyof typeof pipList] = this.processCornerPip(cornerPipSettings, key as keyof typeof pipList)
                } else {
                    this.cornerPips[key as keyof typeof pipList] = undefined
                    delete this.cornerPips[key as keyof typeof pipList];
                }
            }
        } else {
            var replacementPips: typeof this.cornerPips = {}
            for (const [key, cornerPipSettings] of Object.entries(pipList)) {
                if (cornerPipSettings !== undefined) {
                    replacementPips[key as keyof typeof pipList] = (this.processCornerPip(cornerPipSettings, key as keyof typeof pipList, this.cornerPips[key as keyof typeof pipList]))
                } else {
                    replacementPips[key as keyof typeof pipList] = undefined
                    delete replacementPips[key as keyof typeof pipList];
                }
            }
            this.cornerPips = replacementPips
        }
        return this.canvas
    }

    private processCornerPip(cornerPipSettings: CornerPipSettings, location: CornerPipLocation, paths?: CornerPipPath): CornerPipPath {
        log.trace(tag.cardClass, 'processCornerPip(3)', cornerPipSettings, location, paths);
        if (!cornerPipSettings.enabled) {
            return {}
        }
        var cornerPip: Path | undefined = paths?.pip;
        var cornerCharacter: Text | undefined = paths?.character;
        if (cornerPipSettings.pip !== undefined && cornerPipSettings.pip.enabled) {
            log.trace(tag.cardClass, 'cornerPipSettings.pip not undefined')
            const pipSettings = cornerPipSettings.pip
            if (cornerPip === undefined) {
                log.trace(tag.cardClass, 'cornerPip undefined')
                cornerPip = this.canvas.path(this.pipPath)
            }
            cornerPip.fill(pipSettings.color ?? cornerPipSettings.color ?? this.defaultColor)
            var cornerPipSize = this.scaled(pipSettings.width, pipSettings.height);
            cornerPip.size(cornerPipSize.width, cornerPipSize.height)
            if (pipSettings.outline !== undefined && pipSettings.outline.enabled) {
                const outlineSettings = pipSettings.outline
                // const outlineAdjust = outlineSettings.width / 2
                // log.error(tag.cardClass, 'GHFICNSJ')
                // log.error(tag.cardClass, outlineSettings.color)
                cornerPip.stroke({
                    color: outlineSettings.color ?? this.defaultColor,
                    width: this.scaleSingle(outlineSettings.width),
                    opacity: outlineSettings.opacity,
                    linecap: outlineSettings.lineCap,
                    dasharray: outlineSettings.dashArray,
                    dashoffset: outlineSettings.dashOffset
                })
            }
            // const cornerPadding = this.scaled(pipSettings.paddingX, pipSettings.paddingY)
            cornerPip = this.positionCornerItem(
                cornerPip,
                location,
                pipSettings.paddingX,
                pipSettings.paddingY,
                // cornerPadding.width,
                // cornerPadding.height,
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
                size: this.scaleSingle(characterSettings.fontSize),
                anchor: 'middle'
            })
            cornerCharacter.fill(characterSettings.color ?? cornerPipSettings.color ?? this.defaultColor)
            // const cornerPadding = this.scaled(characterSettings.paddingX, characterSettings.paddingY)
            cornerCharacter = this.positionCornerItem(
                cornerCharacter,
                location,
                characterSettings.paddingX,
                characterSettings.paddingY,
                // cornerPadding.width,
                // cornerPadding.height,
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
        const xCenterAdjust = centerPadX ?? false ? item.bbox().w / 2 : 0
        const yCenterAdjust = centerPadY ?? false ? item.bbox().h / 2 : 0
        log.trace(tag.cardClass, xCenterAdjust)
        log.trace(tag.cardClass, yCenterAdjust)
        const backgroundSettings = this.settings.background === undefined ? undefined : mergeTypedSettings(this.settings.background, this.typeColor, this.type, this.faceType) as BackgroundSettings
        const outlineAdjust = outlineAffectsPosition ?? false ? backgroundSettings?.outline?.enabled ?? false ? this.scaleSingle(backgroundSettings?.outline?.width) ?? 0 : 0 : 0
        const paddingScaled = this.scaled(xPad, yPad)
        log.trace(tag.cardClass, paddingScaled.width)
        log.trace(tag.cardClass, paddingScaled.height)
        const xVal = (paddingScaled.width ?? 0) - xCenterAdjust + outlineAdjust
        const yVal = (paddingScaled.height ?? 0) - yCenterAdjust + outlineAdjust
        log.trace(tag.cardClass, xVal)
        log.trace(tag.cardClass, yVal)
        if (location < CornerPipLocationEnum.TopRight) {
            // Top Left - Bottom Right
            item.move(xVal, yVal)
        } else {
            // Top Right - Bottom Left
            item.move(this.canvas.rbox().w - item.bbox().w - xVal, yVal)
        }
        if (location == CornerPipLocationEnum.BottomLeft || location == CornerPipLocationEnum.BottomRight) {
            item.rotate(180, this.cardSize.x / 2, this.cardSize.y / 2)
        }
        return item
    }

    private resetCornerPips(): Svg {
        log.trace(tag.cardClass, 'resetCornerPips()')
        for (var cornerPip of Object.values(this.cornerPips ?? {})) {
            if (cornerPip !== undefined) {
                cornerPip.character?.remove()
                cornerPip.pip?.remove()
            }
        }
        this.cornerPips = {}
        return this.canvas
    }

    private drawCardBackgroundBorder(): Svg {
        log.trace(tag.cardClass, 'drawCardBackground()')
        if (this.cardBackgroundBorder === undefined) {
            this.cardBackgroundBorder = this.canvas.rect(this.cardSize.x, this.cardSize.y)
        }
        const backgroundSettings = this.settings.background === undefined ? undefined : mergeTypedSettings(this.settings.background, this.typeColor, this.type, this.faceType) as BackgroundSettings
        if (backgroundSettings !== undefined && backgroundSettings.enabled) {
            this.moveBackgroundBorder(this.cardBackgroundBorder, backgroundSettings)
        } else {
            this.cardBackgroundBorder.remove()
            this.cardBackgroundBorder = undefined
        }
        return this.canvas
    }

    private drawCardBackground(): Svg {
        log.trace(tag.cardClass, 'drawCardBackground()')
        const backgroundSettings = this.settings.background === undefined ? undefined : mergeTypedSettings(this.settings.background, this.typeColor, this.type, this.faceType) as BackgroundSettings
        var offset = 0
        if (backgroundSettings !== undefined && backgroundSettings.outline !== undefined && backgroundSettings.outline.enabled) {
            const outlineSettings = backgroundSettings.outline
            offset = (this.scaled(outlineSettings.width, undefined).width ?? 0)
        }
        if (this.cardBackground === undefined) {
            this.cardBackground = this.canvas.rect(this.cardSize.x - offset, this.cardSize.y - offset)
        }
        if (backgroundSettings !== undefined && backgroundSettings.enabled) {
            this.moveBackground(this.cardBackground, backgroundSettings)
        } else {
            this.cardBackground.remove()
            this.cardBackground = undefined
        }
        return this.canvas
    }

    private drawCenterBackgroundBorder(): Svg {
        log.trace(tag.cardClass, 'drawCenterBackgroundBorder()')
        const centerBackgroundSettings = (mergeTypedSettings(this.settings.center, this.typeColor, this.type, this.faceType) as CenterSettings).background
        if (this.centerBackgroundBorder === undefined) {
            var backgroundBorderScaled = this.scaled(centerBackgroundSettings?.width ?? 0, centerBackgroundSettings?.height ?? 0)
            this.centerBackgroundBorder = this.canvas.rect(backgroundBorderScaled.width, backgroundBorderScaled.height)
        }
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.enabled) {
            this.moveBackgroundBorder(this.centerBackgroundBorder, centerBackgroundSettings)
        } else {
            this.centerBackgroundBorder.remove()
            this.centerBackgroundBorder = undefined
        }
        return this.canvas
    }

    private drawCenterBackgroundClip(): Svg {
        log.trace(tag.cardClass, 'drawCenterBackground()')
        const centerBackgroundSettings = (mergeTypedSettings(this.settings.center, this.typeColor, this.type, this.faceType) as CenterSettings).background
        var offset = 0
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.outline !== undefined && centerBackgroundSettings.outline.enabled) {
            const outlineSettings = centerBackgroundSettings.outline
            offset = outlineSettings.width ?? 0
        }
        if (this.centerBackgroundClip === undefined) {
            var backgroundClipScaled = this.scaled((centerBackgroundSettings?.width ?? 0) - offset, (centerBackgroundSettings?.height ?? 0) - offset)
            this.centerBackgroundClip = this.canvas.rect(backgroundClipScaled.width, backgroundClipScaled.height)
        }
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.enabled) {
            this.moveBackground(this.centerBackgroundClip, centerBackgroundSettings)
        } else {
            this.centerBackgroundClip.remove()
            this.centerBackgroundClip = undefined
        }
        return this.canvas
    }

    private drawCenterBackground(): Svg {
        log.trace(tag.cardClass, 'drawCenterBackground()')
        const centerBackgroundSettings = (mergeTypedSettings(this.settings.center, this.typeColor, this.type, this.faceType) as CenterSettings).background
        var offset = 0
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.outline !== undefined && centerBackgroundSettings.outline.enabled) {
            const outlineSettings = centerBackgroundSettings.outline
            offset = outlineSettings.width ?? 0
        }
        if (this.centerBackground === undefined) {
            var backgroundScaled = this.scaled((centerBackgroundSettings?.width ?? 0) - offset, (centerBackgroundSettings?.height ?? 0) - offset)
            this.centerBackground = this.canvas.rect(backgroundScaled.width, backgroundScaled.height)
        }
        if (centerBackgroundSettings !== undefined && centerBackgroundSettings.enabled) {
            this.moveBackground(this.centerBackground, centerBackgroundSettings)
        } else {
            this.centerBackground.remove()
            this.centerBackground = undefined
        }
        return this.canvas
    }

    private moveBackgroundBorder(backgroundBorder: Rect, settings: BackgroundSettings | CenterBackgroundSettings): Svg {
        log.trace(tag.cardClass, 'moveBackgroundBorder()')
        const padding = isCenterBackgroundSettings(settings) ? { width: (settings as CenterBackgroundSettings).paddingX, height: (settings as CenterBackgroundSettings).paddingY } : { width: 0, height: 0 }
        const paddingX = padding.width ?? 0
        const paddingY = padding.height ?? 0
        const size = isCenterBackgroundSettings(settings) ? { width: (settings as CenterBackgroundSettings).width, height: (settings as CenterBackgroundSettings).height } : { width: 0, height: 0 }
        log.trace(tag.cardClass, 'original size')
        log.trace(tag.cardClass, size)
        const width = size.width ?? 0
        const height = size.height ?? 0
        backgroundBorder.remove()
        if (settings.outline !== undefined && settings.outline.enabled) {
            const outlineSettings = settings.outline
            const outlineAdjust = (outlineSettings.width ?? 0) / 2
            log.trace(tag.cardClass, `settings.radius ${settings.radius}`)
            log.trace(tag.cardClass, `outlineSettings.width ${outlineSettings.width ?? 0}`)
            log.trace(tag.cardClass, `height ${height}`)
            log.trace(tag.cardClass, { width: width - (outlineSettings.width ?? 0), height: height - (outlineSettings.width ?? 0) })
            var backgroundBorderScaled = this.scaled(width - (outlineSettings.width ?? 0), height - (outlineSettings.width ?? 0))
            log.trace(tag.cardClass, backgroundBorderScaled)
            backgroundBorder = this.canvas.rect(backgroundBorderScaled.width, backgroundBorderScaled.height)
            //@ts-ignore
            const backgroundBorderMoveScaled = this.scaled(paddingX + outlineAdjust, paddingY + outlineAdjust)
            backgroundBorder.move(backgroundBorderMoveScaled.width, backgroundBorderMoveScaled.height)
            backgroundBorder.fill('none')
            backgroundBorder.stroke({
                color: outlineSettings.color ?? this.defaultColor,
                width: this.scaleSingle(outlineSettings.width),
                opacity: outlineSettings.opacity,
                linecap: outlineSettings.lineCap,
                dasharray: outlineSettings.dashArray,
                dashoffset: outlineSettings.dashOffset
            })
            backgroundBorder.radius(settings.radius ?? 0)
        }
        return this.canvas
    }

    private moveBackground(background: Rect, settings: BackgroundSettings | CenterBackgroundSettings): Svg {
        log.trace(tag.cardClass, 'moveBackground()')
        const padding = isCenterBackgroundSettings(settings) ? this.scaled((settings as CenterBackgroundSettings).paddingX, (settings as CenterBackgroundSettings).paddingY) : { width: 0, height: 0 }
        const paddingX = padding.width ?? 0
        const paddingY = padding.height ?? 0
        var offset = 0
        if (settings.outline !== undefined && settings.outline.enabled) {
            const outlineSettings = settings.outline
            const outlineWidthScaled = this.scaleSingle(outlineSettings.width) ?? 0
            offset = outlineWidthScaled / 2
        }
        //@ts-ignore
        background.move(paddingX + offset, paddingY + offset)
        background.fill(settings.color ?? 'none')
        background.radius(settings.radius ?? 0)
        return this.canvas
    }

    private drawCenterPips(): Svg {
        log.trace(tag.cardClass, 'drawCenterPips()')
        const centerSettings = mergeTypedSettings(this.settings.center, this.typeColor, this.type, this.faceType) as CenterSettings
        if (centerSettings.pips !== undefined && centerSettings.pips.enabled) {
            const centerPipSettings = centerSettings.pips
            const pipLocationSelection = pipLocations[centerSettings.pips.location]
            // log.warn(tag.cardClass, 'pipLocationSelection', pipLocations, centerSettings.pips.location, pipLocationSelection);
            const pipLocationsList = pipLocationSelection[this.pipName] ?? []
            // log.warn(tag.cardClass, 'pipLocationsList', pipLocationSelection, this.pipName, typeof this.pipName, pipLocationsList);
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
                var replacementPips: (Path| Svg)[] = []
                for (let index = 0; index < this.centerPips.length; index++) {
                // for (const [index, centerPip] of this.centerPips.entries()) {
                    const centerPip = this.centerPips[index];
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

    private drawFaceCards(): Svg {
        log.trace(tag.cardClass, 'drawFaceCards()')
        const centerSettings = mergeTypedSettings(this.settings.center, this.typeColor, this.type, this.faceType) as CenterSettings
        if (centerSettings.face !== undefined && centerSettings.face.enabled) {
            const faceSettings = centerSettings.face
            const padding = this.scaled(faceSettings.paddingX, faceSettings.paddingY)
            const paddingX = padding.width ?? 0
            const paddingY = padding.height ?? 0
            var doubleGroup = this.canvas.group()
            var group = doubleGroup.group()
            const faceSelection = (faceLayouts[this.pipName] ?? {})[this.type] ?? {}
            if (Object.keys(faceSelection).length === 0) {
                return this.canvas
            }
            log.trace(tag.cardClass, 'faceSelection')
            log.trace(tag.cardClass, Object.keys(faceSelection).length)
            log.trace(tag.cardClass, Object.keys((faceSettings.color ?? {})).length)
            // var count = 1
            if (faceSettings.color !== undefined) {
                for (var colorNumberStr of Object.keys(faceSettings.color)) {
                    log.trace(tag.cardClass, `Setting colorNumber ${colorNumberStr}`)
                    var actualColorNumber = colorNumberStr;
                    let colorNumber = NaN;
                    try {
                        colorNumber = parseInt(`${colorNumberStr}`);
                        actualColorNumber = `${colorNumber + 1}`;
                    }
                    catch {
                        log.error(tag.cardClass, `Cannot parse in for color number ${colorNumber}`)
                    }
                    if (Object.prototype.hasOwnProperty.call(faceSelection, actualColorNumber)) {
                        log.trace(tag.cardClass, 'new path')
                        var pathString = faceSelection[actualColorNumber].path
                        var path = group.path(pathString)
                        log.trace(tag.cardClass, `Path Count ${actualColorNumber}`)
                        log.trace(tag.cardClass, path.bbox())
                        const color = faceSettings.color[colorNumber]
                        if (faceSelection[actualColorNumber].type === 'fill') {
                            path.fill({
                                color: color,
                                opacity: 1
                            })
                        } else {
                            path.fill({
                                color: color,
                                opacity: 0
                            })
                            path.stroke({
                                color: color,
                                width: faceSelection[actualColorNumber].width
                            })
                        }
                        group.add(path)
                    }
                    // count++;
                    // log.trace(tag.cardClass, `Counting ${count}`)
                }
            }

            var rotX = 0
            var rotY = 0

            // Add rotate point if exists
            if (Object.prototype.hasOwnProperty.call(faceSelection, 'rotate')) {
                var pathString = faceSelection.rotate.path
                var rotatePath = group.path(pathString)
                rotatePath.fill('none')
                group.add(rotatePath)
                rotX = rotatePath.rbox(this.canvas).x + (rotatePath.rbox(this.canvas).w / 2)
                rotY = rotatePath.rbox(this.canvas).y + (rotatePath.rbox(this.canvas).h / 2)
                log.trace(tag.cardClass, 'rotate path', rotX, rotY, rotatePath)
            } else {
                rotX = group.bbox().w / 2
                rotY = group.bbox().h
            }

            var faceClone = group.clone()
            doubleGroup.add(faceClone)
            faceClone.rotate(180, rotX, rotY)

            log.trace(tag.cardClass, 'drawFaceCards(scaling)')
            var offset = 0
            if (centerSettings.background !== undefined && centerSettings.background.outline !== undefined && centerSettings.background.outline.enabled) {
                const outlineSettings = centerSettings.background.outline
                offset = outlineSettings.width ?? 0
            }
            log.trace(tag.cardClass, 'original size')
            log.trace(tag.cardClass, { width: faceSettings.width ?? 0, height: faceSettings.height ?? 0 })
            log.trace(tag.cardClass, `outlineSettings.width ${offset}`)
            var doubleGroupScaled = this.scaled((faceSettings.width ?? 0) - offset, (faceSettings.height ?? 0) - offset)
            log.trace(tag.cardClass, { width: (faceSettings.width ?? 0) - offset, height: (faceSettings.height ?? 0) - offset })
            log.trace(tag.cardClass, doubleGroupScaled)
            doubleGroup.size(doubleGroupScaled.width, doubleGroupScaled.height)
            //@ts-ignore
            doubleGroup.move(paddingX + (offset / 2), paddingY + (offset / 2))
            this.canvas.add(doubleGroup)
            if (this.centerBackgroundClip !== undefined) {
                var clip = doubleGroup.clip().add(this.centerBackgroundClip)
                doubleGroup.clipWith(clip)
            }
        }
        return this.canvas
    }

    private styleCenterPip(pip: Path | Svg, centerPipSettings: CenterPipSettings): Path | Svg {
        pip.fill(centerPipSettings.color ?? this.defaultColor)
        var pipScaled = this.scaled(centerPipSettings.width, centerPipSettings.height)
        pip.size(pipScaled.width, pipScaled.height)
        if (centerPipSettings.outline !== undefined && centerPipSettings.outline.enabled) {
            const outlineSettings = centerPipSettings.outline
            const outlineWidthScaled = this.scaleSingle(outlineSettings.width)
            pip.stroke({
                color: outlineSettings.color ?? this.defaultColor,
                width: outlineWidthScaled,
                opacity: outlineSettings.opacity,
                linecap: outlineSettings.lineCap,
                dasharray: outlineSettings.dashArray,
                dashoffset: outlineSettings.dashOffset
            })
        }
        return pip
    }

    private processCenterPip(centerPipSettings: CenterPipSettings, location: RotatableXY, pip?: Path | Svg): Path | Svg {
        log.trace(tag.cardClass, 'processCenterPip(3)', centerPipSettings, location, pip);
        if (location.symetrical ?? false) {
            pip = this.createSymetrical(centerPipSettings)
        }
        else {
            if (pip === undefined) {
                log.trace(tag.cardClass, 'pip undefined')
                pip = this.canvas.path(this.pipPath)
            }
            pip = this.styleCenterPip(pip, centerPipSettings)
        }
        const zeroX = this.cardSize.x / 2
        const zeroY = this.cardSize.y / 2
        const locationsScaled = this.scaled(location.x * centerPipSettings.locationScale, location.y * centerPipSettings.locationScale)
        const locationXScaled = locationsScaled.width
        const locationYScaled = locationsScaled.height
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

    private createSymetrical(centerPipSettings: CenterPipSettings): Path | Svg {
        log.trace(tag.cardClass, 'createSymetrical(1)', centerPipSettings);
        var nested = this.canvas.nested()
        var pip: Path | Svg = nested.path(this.pipPath)
        pip = this.styleCenterPip(pip, centerPipSettings)
        pip.move(0, 0)
        var w = pip.bbox().w
        var h = pip.bbox().h
        nested.size(w, h)
        var symetricalSettings = centerPipSettings.symetrical ?? { type: 'straight' }
        var spikeDepth = symetricalSettings.type === 'straight' ? 0 : symetricalSettings.spikeDepth ?? w / 10
        var spikeCount = symetricalSettings.type === 'straight' ? 0 : symetricalSettings.spikeCount ?? 5
        var splitter = this[`${symetricalSettings.type ?? 'straight'}Edge`](nested, w * 2, h * 2, spikeDepth, spikeCount * 2)
        splitter.move(-1 * ((w * 1.5) - (spikeDepth / 2)), -1 * (h / 2)).fill('#FFF')
        splitter.rotate(symetricalSettings.angle ?? 0, w / 2, h / 2)
        var mask = nested.mask()
        mask.add(splitter)
        pip.maskWith(mask)
        var pipClone = pip.clone()
        nested.add(pipClone)
        pipClone.rotate(180, w / 2, h / 2)
        this.canvas.add(nested)
        return nested
    }

    private spikedEdge(canvas: Svg, width: number, height: number, spikeDepth: number, spikes: number): Polygon {
        log.trace(tag.cardClass, 'spikedEdge(5)', canvas, width, height, spikeDepth, spikes);
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

    private jaggedEdge(canvas: Svg, width: number, height: number, spikeDepth: number, spikes: number): Polygon {
        log.trace(tag.cardClass, 'jaggedEdge(5)', canvas, width, height, spikeDepth, spikes);
        var points = `0,${height} 0,0 ${width},0`
        var interval = height / spikes
        for (var i = 0; i < spikes; i++) {
            points += ` ${width - spikeDepth},${(i * interval)}`
            points += ` ${width},${(i * interval) + interval}`
        }
        var polygon = canvas.polygon(points)
        return polygon
    }

    private straightEdge(canvas: Svg, width: number, height: number, spikeDepth: number, spikes: number): Polygon {
        log.trace(tag.cardClass, 'straightEdge(5)', canvas, width, height, spikeDepth, spikes);
        var points = `0,${height} 0,0 ${width},0 ${width},${height}`
        var polygon = canvas.polygon(points)
        return polygon
    }

    /*
    private drawBBox(bbox: Box) {
        this.drawDebug(bbox.x, bbox.y, bbox.width, bbox.height)
    }

    private drawDebug(x: number, y: number, width: number, height: number) {
        var rect = this.canvas.rect(width, height)
        rect.move(x, y)
        rect.fill('none')
        rect.stroke({
            width: 0.1,
            color: '#F00'
        })
    }
    */

}