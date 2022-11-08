import { Svg } from '@svgdotjs/svg.js'

import { log, tag } from 'missionlog';
import {
    CardStorage,
    XY
} from "../types";
import { getClosestFactors } from "../functions";

export class CardGrid {

    private canvas: Svg;
    private cards: CardStorage;
    private order: string[];
    private cardSize: XY;

    private _factors: number[] = [];

    constructor(canvas: Svg, cards: CardStorage, order: string[], cardSize?: XY) {
        log.trace(tag.gridClass, 'constructor()')
        this.canvas = canvas
        this.cards = cards
        this.order = order
        this.cardSize = cardSize || {
            x: this.cards[Object.keys(this.cards)[0]].canvas.rbox().w,
            y: this.cards[Object.keys(this.cards)[0]].canvas.rbox().h
        }
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
        for (const card of this.order) {
            const svg = this.cards[card]
            var x = count % this.factors[0]
            var y = (count - (x)) / this.factors[0]
            count++;
            log.trace(tag.gridClass, {x: x, y: y})
            var nested = this.canvas.nested()
            nested.size(this.cardSize.x, this.cardSize.y)
            nested.move(this.cardSize.x * x, this.cardSize.y * y)
            nested.svg(svg.canvas.svg())
        }
    }

}