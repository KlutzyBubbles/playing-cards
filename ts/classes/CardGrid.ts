import { Svg, SVG } from '@svgdotjs/svg.js'
import $ from "jquery";
import { log, tag } from 'missionlog';
import {
    CardSettings,
    CardStorage,
    PipCharacterCombo,
    XY
} from "../types";
import { cardSize as cardSizeConstant } from '../constants'
import { generateString, getClosestFactors } from "../functions";
import { CardSvg } from './CardSvg';

export class CardGrid {

    private canvas: Svg;
    private cards: CardStorage;
    private order: PipCharacterCombo[];
    private settings: CardSettings;
    private cardSize: XY;
    private containerId: string;

    private _factors: number[] = [];

    constructor(canvas: Svg, settings: CardSettings, order: PipCharacterCombo[], cardSize?: XY) {
        log.trace(tag.gridClass, 'constructor()')
        this.canvas = canvas
        this.cards = {}
        this.order = order
        this.settings = settings
        this.cardSize = cardSize || (Object.keys(this.cards).length > 0 ? {
            x: this.cards[Object.keys(this.cards)[0]].canvas.rbox().w,
            y: this.cards[Object.keys(this.cards)[0]].canvas.rbox().h
        } : cardSizeConstant)
        this.containerId = this.generateCards()
        this.setSize()
        this.drawCards()
    }

    get factors(): number[] {
        log.trace(tag.gridClass, 'factors()')
        if (this._factors === undefined || this._factors.length === 0) {
            this._factors = getClosestFactors(this.order.length)
        }
        return this._factors
    }

    private generateCards() {
        var containerId = generateString(20)
        $(`#${this.canvas.node.parentElement?.getAttribute('id')}`).append(`<div id="${containerId}"></div>`)
        for (var combo of this.order) {
            var draw = SVG().addTo(`#${containerId}`).size(`${this.cardSize.x}px`, `${this.cardSize.y}px`)
            var card = new CardSvg(draw, this.settings, combo.pip, combo.character)
            card.drawCard()
            const value = `${combo.character.toLowerCase()}:${combo.pip}`
            this.cards[value] = card
        }
        return containerId
    }

    private setSize() {
        log.trace(tag.gridClass, 'setSize()')
        const factors = this.factors
        const width = this.cardSize.x * factors[0]
        const height = this.cardSize.y * factors[1]
        log.trace(tag.gridClass, width)
        log.trace(tag.gridClass, height)
        this.canvas.size(`${width}px`, `${height}px`)
    }

    private drawCards() {
        log.trace(tag.gridClass, 'drawCards()')
        var count = 0
        for (const combo of this.order) {
            const svg = this.cards[`${combo.character.toLowerCase()}:${combo.pip}`]
            var x = count % this.factors[0]
            var y = (count - (x)) / this.factors[0]
            count++;
            log.trace(tag.gridClass, {x: x, y: y})
            var nested = this.canvas.nested()
            nested.size(this.cardSize.x, this.cardSize.y)
            nested.move(this.cardSize.x * x, this.cardSize.y * y)
            nested.svg(svg.canvas.svg())
        }
        $(`#${this.containerId}`).hide()
    }

}