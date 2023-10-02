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
    private settings: CardSettings | undefined;
    private cardSize: XY;
    private containerId: string;

    private _factors: number[] = [];

    constructor(canvas: Svg, settings: CardSettings | undefined, order: PipCharacterCombo[], cardSize?: XY) {
        log.trace(tag.gridClass, 'constructor()')
        this.canvas = canvas
        this.cards = {}
        this.order = order
        this.settings = settings
        this.cardSize = cardSize || (Object.keys(this.cards).length > 0 ? {
            x: this.cards[Object.keys(this.cards)[0]].canvas.rbox().w,
            y: this.cards[Object.keys(this.cards)[0]].canvas.rbox().h
        } : cardSizeConstant)
        this.setSize()
    }

    get factors(): number[] {
        log.trace(tag.gridClass, 'factors()')
        if (this._factors === undefined || this._factors.length === 0) {
            this._factors = getClosestFactors(this.order.length) || [0, 0]
        }
        return this._factors
    }

    private regenFactors(): number[] {
        log.trace(tag.gridClass, 'regenFactors()')
        this._factors = getClosestFactors(this.order.length) || [0, 0]
        return this._factors
    }

    private generateCards() {
        log.trace(tag.gridClass, 'generateCards()')
        if (this.settings === undefined)
            return
        var containerId = generateString(20)
        log.trace(tag.gridClass, `ContainerID: ${containerId}`)
        $(`#${this.canvas.node.parentElement?.getAttribute('id')}`).append(`<div id="${containerId}"></div>`)
        for (var combo of this.order) {
            var draw = SVG().addTo(`#${containerId}`).size(`${this.cardSize.x}px`, `${this.cardSize.y}px`)
            var card = new CardSvg(draw, this.settings, combo.pip, combo.character)
            card.drawCard()
            const value = `${combo.character.toLowerCase()}:${combo.pip}`
            this.cards[value] = card
        }
        this.containerId = containerId
        return containerId
    }

    private setSize() {
        log.trace(tag.gridClass, 'setSize()')
        const factors = this.regenFactors()
        const width = this.cardSize.x * factors[0]
        const height = this.cardSize.y * factors[1]
        log.trace(tag.gridClass, width)
        log.trace(tag.gridClass, height)
        this.canvas.size(`${width}px`, `${height}px`)
    }

    public setSettings(settings: CardSettings) {
        this.settings = settings
    }

    public setOrder(order: PipCharacterCombo[]) {
        this.order = order
        this.setSize()
    }

    public resetCards() {
        log.trace(tag.gridClass, 'resetCards()')
        this.canvas.clear()
        this.cards = {}
    }

    public redrawCards() {
        log.trace(tag.gridClass, 'drawCards()')
        if (this.settings === undefined)
            return
        this.resetCards()
        this.generateCards()
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