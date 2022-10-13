
import { Path, Text } from '@svgdotjs/svg.js'

type HexColor = `#${string}`;

export interface CornerPipSubSettings extends CornerPipSubSettingsBase {
    width: number
    height?: number
}

export interface CornerPipCharacterSettings extends CornerPipSubSettingsBase {
    fontSize: number
    font?: string
}

export interface CornerPipSubSettingsBase {
    enabled: boolean
    paddingY: number
    paddingX: number
    centerPad?: boolean
    centerPadX?: boolean
    centerPadY?: boolean
    outlineAffectsPosition?: boolean
    color?: HexColor
}

export type PipType = 'club' | 'spade' | 'heart' | 'diamond'
export type LineCap = 'butt' | 'round' | 'square'

export enum CornerPipLocation {
    TopLeft = 0,
    BottomRight = 1,
    TopRight = 2,
    BottomLeft = 3
}

export interface CornerPipSettings {
    enabled: boolean
    location: CornerPipLocation
    character?: CornerPipCharacterSettings
    outlineAffectsPosition?: boolean
    pip?: CornerPipSubSettings
    color?: HexColor
}

export interface DefaultColors {
    club?: HexColor
    spade?: HexColor
    heart?: HexColor
    diamond?: HexColor
    red?: HexColor
    black?: HexColor
    default: HexColor
}

export interface OutlineSettings {
    enabled: boolean
    color?: HexColor
    opacity?: number
    lineCap?: LineCap
    dashArray?: string
    dashOffset?: number
    width: number
}

export interface BackgroundSettings {
    enabled: boolean
    outline?: OutlineSettings
    color: HexColor
    radius?: number
}

export interface CenterBackgroundSettings extends BackgroundSettings {
    paddingX?: number
    paddingY?: number
    width: number
    height: number
}

export enum PipLocationName {
    Standard = 0,
    Symmetrical = 1,
}

export interface Scale {
    width?: number
    height?: number
}

export interface CenterPipSettings {
    enabled: boolean
    scale: Scale | Scale[]
    location: PipLocationName
    locationScale: number
}

export enum Orientation {
    Horizontal = 0,
    Vertical = 1
}

export interface LineSettings {
    length: number
    strokeSize: number
    padding?: number
    color?: HexColor
    orientation?: Orientation
}

export interface CenterSettings {
    background?: CenterBackgroundSettings
    pips?: CenterPipSettings
    lines?: LineSettings[]
}

export interface CardSettings {
    outlineAffectsPosition?: boolean
    background?: BackgroundSettings
    defaultColors: DefaultColors
    center: CenterSettings
    cornerPips: CornerPipSettings[]
}

export interface XY {
    x: number,
    y: number
}

export interface RotatableXY extends XY {
    rotation?: number
}

export interface CenterPipLayout {
    [key: string]: RotatableXY[]
}

export interface CornerPipPath {
    character?: Text,
    pip?: Path
}