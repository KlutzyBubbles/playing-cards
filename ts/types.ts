
import { Path, Text } from '@svgdotjs/svg.js'

export type HexColor = `#${string}`;

export interface CornerPipSubSettings extends CornerPipSubSettingsBase, Scale {}

export interface CornerPipCharacterSettings extends CornerPipSubSettingsBase {
    fontSize: number
    font?: string
}

export interface CornerPipSubSettingsBase {
    enabled: boolean
    paddingY?: number
    paddingX?: number
    centerPad?: boolean
    centerPadX?: boolean
    centerPadY?: boolean
    outlineAffectsPosition?: boolean
    color?: HexColor
}

export type PipType = 'club' | 'spade' | 'heart' | 'diamond'
export type TypeColor = 'black' | 'red' | 'all'
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
export interface TypedCornerPipSettings {
    club?: CornerPipSettings
    spade?: CornerPipSettings
    heart?: CornerPipSettings
    diamond?: CornerPipSettings
    red?: CornerPipSettings
    black?: CornerPipSettings
    all: CornerPipSettings
}

export interface DefaultColors {
    club?: HexColor
    spade?: HexColor
    heart?: HexColor
    diamond?: HexColor
    red?: HexColor
    black?: HexColor
    all: HexColor
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

export interface TypedBackgroundSettings {
    club?: BackgroundSettings
    spade?: BackgroundSettings
    heart?: BackgroundSettings
    diamond?: BackgroundSettings
    red?: BackgroundSettings
    black?: BackgroundSettings
    all: BackgroundSettings
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
    color?: HexColor
    width?: number
    height?: number
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
export interface TypedCenterSettings {
    club?: CenterSettings
    spade?: CenterSettings
    heart?: CenterSettings
    diamond?: CenterSettings
    red?: CenterSettings
    black?: CenterSettings
    all: CenterSettings
}

export interface CardSettings {
    outlineAffectsPosition?: boolean
    background?: TypedBackgroundSettings
    defaultColors: DefaultColors
    center: TypedCenterSettings
    cornerPips: TypedCornerPipSettings[]
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