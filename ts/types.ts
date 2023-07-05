
import { Path, Text } from '@svgdotjs/svg.js'
import { CardSvg } from './classes/CardSvg';

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
    outline?: OutlineSettings
}

export type PipType = 'club' | 'spade' | 'heart' | 'diamond'
export type TypeColor = 'black' | 'red' | 'all'
export type FaceType = 'value' | 'face' | 'unknown'
export type LineCap = 'butt' | 'round' | 'square'

export enum CornerPipLocation {
    TopLeft = 0,
    BottomRight = 1,
    TopRight = 2,
    BottomLeft = 3
}

export interface CornerPipSettings {
    enabled: boolean
    character?: CornerPipCharacterSettings
    outlineAffectsPosition?: boolean
    pip?: CornerPipSubSettings
    color?: HexColor
}

export interface CornerPipLocationSettings {
    topLeft?: TypedKey<CornerPipSettings>
    bottomRight?: TypedKey<CornerPipSettings>
    topRight?: TypedKey<CornerPipSettings>
    bottomLeft?: TypedKey<CornerPipSettings>
}

export interface TypedKey<T extends CornerPipSettings | BackgroundSettings | CenterSettings> {
    club?: Partial<T>
    spade?: Partial<T>
    heart?: Partial<T>
    diamond?: Partial<T>
    red?: Partial<T>
    black?: Partial<T>
    value?: Partial<T>
    face?: Partial<T>
    all: T
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

export interface CenterBackgroundSettings extends BackgroundSettings {
    paddingX?: number
    paddingY?: number
    width: number
    height: number
}

export enum PipLocationName {
    Standard = 0,
    Symmetrical = 1,
    SymmetricalAlt = 2,
}

export interface Scale {
    width?: number
    height?: number
}

export type SymetricalType = 'straight' | 'jagged' | 'spiked'

export interface SymetricalSettings {
    type: SymetricalType
    spikeCount?: number
    spikeDepth?: number
    angle?: number
}

export interface CenterPipSettings {
    enabled: boolean
    symetrical?: SymetricalSettings
    color?: HexColor
    outline?: OutlineSettings
    width?: number
    height?: number
    location: PipLocationName
    locationScale: number
}

export interface FaceSettings {
    enabled: boolean
    color?: HexColor[]
    width?: number
    height?: number
    paddingX?: number
    paddingY?: number
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
    face?: FaceSettings
    lines?: LineSettings[]
}

export interface CardSettings {
    outlineAffectsPosition?: boolean
    background?: TypedKey<BackgroundSettings>
    defaultColors: DefaultColors
    center: TypedKey<CenterSettings>
    cornerPips: CornerPipLocationSettings
}

export interface XY {
    x: number,
    y: number
}

export interface RotatableXY extends XY {
    rotation?: number
    symetrical?: boolean
}

export interface CenterPipLayout {
    [key: string]: RotatableXY[]
}

export interface FaceLayout {
    [key: string]: FaceSuit
}

export interface FaceSuit {
    club?: FaceLayers
    spade?: FaceLayers
    diamond?: FaceLayers
    heart?: FaceLayers
}
export interface FaceLayers {
    [key: string]: FaceLayer
}

export type FaceLayerType = 'stroke' | 'fill'

export interface FaceLayer {
    type: string
    width: number
    path: string
}

export interface CornerPipPath {
    character?: Text,
    pip?: Path
}

export interface CardStorage {
    [key: string]: CardSvg
}
