import { Svg, SVG } from '@svgdotjs/svg.js'
// import $ from "jquery";
import { log, tag } from 'missionlog';
import type {
    CardSettings,
    ImageFormat,
    PipCharacterCombo,
    XY
} from "../types";
import { cardSize as cardSizeConstant } from '../constants'
import { generateString } from "../functions";
import { CardSvg } from './CardSvg';

export class CardPreview {

    private canvas: Svg;
    private card: CardSvg | undefined;
    private combo: PipCharacterCombo;
    private settings: CardSettings | undefined;
    private cardSize: XY;
    // private containerId: string;

    constructor(canvas: Svg, settings: CardSettings | undefined, combo: PipCharacterCombo, cardSize?: XY, factors?: number[]) {
        log.trace(tag.gridClass, 'constructor()')
        this.canvas = canvas
        this.card = undefined
        this.combo = combo
        this.settings = settings
        this.cardSize = cardSize || cardSizeConstant
        this.setSize()
    }

    private generateCards(): string | undefined {
        log.trace(tag.gridClass, 'generateCards()')
        if (this.settings === undefined)
            return
        var containerId = generateString(20, true)
        log.trace(tag.gridClass, `ContainerID: ${containerId}`)
        // $(`#${this.canvas.node.parentElement?.getAttribute('id')}`).append(`<div id="${containerId}"></div>`)
        var draw = SVG().addTo(`#${containerId}`).size(`${this.cardSize.x}px`, `${this.cardSize.y}px`)
        var card = new CardSvg(draw, this.settings, this.combo.pip, this.combo.character)
        card.drawCard()
        this.card = card
        // this.containerId = containerId
        return containerId
    }

    private setSize(): void {
        log.trace(tag.gridClass, 'setSize()')
        const width = this.cardSize.x
        const height = this.cardSize.y
        log.trace(tag.gridClass, width)
        log.trace(tag.gridClass, height)
        this.canvas.size(`${width}px`, `${height}px`)
    }

    public setSettings(settings: CardSettings): void {
        this.settings = settings
    }

    public setCombo(combo: PipCharacterCombo): void {
        this.combo = combo
    }

    public resetCards(): void {
        log.trace(tag.gridClass, 'resetCards()')
        this.canvas.clear()
        this.card = undefined
    }

    public redraw(): void {
        log.trace(tag.gridClass, 'drawCards()')
        if (this.settings === undefined)
            return
        this.resetCards()
        this.generateCards()
        var count = 0
        const svg = this.card
        if (svg === undefined) {
            log.debug(tag.gridClass, 'Unknown SVG on redraw');
            return;
        }
        var x = 0
        var y = 0
        count++;
        log.trace(tag.gridClass, {x: x, y: y})
        var nested = this.canvas.nested()
        nested.size(this.cardSize.x, this.cardSize.y)
        nested.move(this.cardSize.x * x, this.cardSize.y * y)
        nested.svg(svg.canvas.svg())
        // $(`#${this.containerId}`).hide()
    }

    public export(format: ImageFormat): string | undefined {
        if (format === 'svg') {
            return this.canvas.svg()
        }
        log.error(tag.gridClass, `Unfinished format supplied: ${format}`)
        return undefined
    }

}