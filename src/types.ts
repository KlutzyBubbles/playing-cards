
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

// export type PipType = 'club' | 'spade' | 'heart' | 'diamond'
export type TypeColor = 'black' | 'red' | 'all'
export type FaceType = 'value' | 'face' | 'unknown'
export type LineCap = 'butt' | 'round' | 'square'

export interface PipCharacterCombo {
    pip: Suit
    character: Character
}

export enum CornerPipLocationEnum {
    TopLeft = 'topLeft',
    BottomRight = 'bottomRight',
    TopRight = 'topRight',
    BottomLeft = 'bottomLeft'
}

export const CornerPipLocations = [
    CornerPipLocationEnum.TopLeft,
    CornerPipLocationEnum.BottomRight,
    CornerPipLocationEnum.TopRight,
    CornerPipLocationEnum.BottomLeft
] as const satisfies `${CornerPipLocationEnum}`[]

export type CornerPipLocation = typeof CornerPipLocations[number];

export enum CharacterEnum {
    ACE = "A",
    ZERO = "0",
    ONE = "1",
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    EIGHT = "8",
    NINE = "9",
    TEN = "10",
    ELEVEN = "11",
    TWELVE = "12",
    THIRTEEN = "13",
    JACK = "J",
    QUEEN = "Q",
    KING = "K",
}

export const Characters = [
    CharacterEnum.ACE,
    CharacterEnum.ZERO,
    CharacterEnum.ONE,
    CharacterEnum.TWO,
    CharacterEnum.THREE,
    CharacterEnum.FOUR,
    CharacterEnum.FIVE,
    CharacterEnum.SIX,
    CharacterEnum.SEVEN,
    CharacterEnum.EIGHT,
    CharacterEnum.NINE,
    CharacterEnum.TEN,
    CharacterEnum.ELEVEN,
    CharacterEnum.TWELVE,
    CharacterEnum.THIRTEEN,
    CharacterEnum.JACK,
    CharacterEnum.QUEEN,
    CharacterEnum.KING,
] as const satisfies `${CharacterEnum}`[]

export type Character = typeof Characters[number];

export enum SuitEnum {
    CLUB = "club",
    DIAMOND = "diamond",
    SPADE = "spade",
    HEART = "heart"
}

export const Suits = [
    SuitEnum.CLUB,
    SuitEnum.DIAMOND,
    SuitEnum.SPADE,
    SuitEnum.HEART,
] as const satisfies `${SuitEnum}`[]

export type Suit = typeof Suits[number];

export enum ImageFormatEnum {
    PNG = "png",
    JPEG = "jpeg",
    SVG = "svg"
}

export const ImageFormats = [
    ImageFormatEnum.PNG,
    ImageFormatEnum.JPEG,
    ImageFormatEnum.SVG
] as const satisfies `${ImageFormatEnum}`[]

export type ImageFormat = typeof ImageFormats[number];

export enum PredefinedSettingEnum {
    CRAZY = "crazy",
    STANDARD = "standard"
}

export const PredefinedSettings = [
    PredefinedSettingEnum.CRAZY,
    PredefinedSettingEnum.STANDARD
] as const satisfies `${PredefinedSettingEnum}`[]

export type PredefinedSetting = typeof PredefinedSettings[number];

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

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface TypedKey<T extends CornerPipSettings | BackgroundSettings | CenterSettings> {
    club?: DeepPartial<T>
    spade?: DeepPartial<T>
    heart?: DeepPartial<T>
    diamond?: DeepPartial<T>
    red?: DeepPartial<T>
    black?: DeepPartial<T>
    value?: DeepPartial<T>
    face?: DeepPartial<T>
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
    width?: number
}

export interface BackgroundSettings {
    enabled: boolean
    outline?: OutlineSettings
    color?: HexColor
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
    color?: FaceColorSettings
    width?: number
    height?: number
    paddingX?: number
    paddingY?: number
}

export interface FaceColorSettings {
    [key: number]: HexColor
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
