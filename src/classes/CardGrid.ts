import { Svg, SVG } from '@svgdotjs/svg.js'
// import $ from "jquery";
import { log, tag } from 'missionlog';
import {
    ImageFormatEnum,
    type CardSettings,
    type CardStorage,
    type ImageFormat,
    type PipCharacterCombo,
    type XY
} from "../types";
import { cardSize as cardSizeConstant } from '../constants'
import { getClosestFactors, svgToCanvas } from "../functions";
import { CardSvg } from './CardSvg';

export class CardGrid {

    public canvas: Svg;
    private cards: CardStorage;
    private order: PipCharacterCombo[];
    private settings: CardSettings | undefined;
    private cardSize: XY;
    // private containerId: string;

    private _factors: number[] = [];

    constructor(canvas: Svg, settings: CardSettings | undefined, order: PipCharacterCombo[], cardSize?: XY, factors?: number[]) {
        log.trace(tag.gridClass, 'constructor()')
        this.canvas = canvas
        this.cards = {}
        this.order = order
        this.settings = settings
        this.cardSize = cardSize || (Object.keys(this.cards).length > 0 ? {
            x: this.cards[Object.keys(this.cards)[0]].canvas.rbox().w,
            y: this.cards[Object.keys(this.cards)[0]].canvas.rbox().h
        } : cardSizeConstant)
        this._factors = factors || []
        this.setSize(this.factors)
    }

    get factors(): number[] {
        log.trace(tag.gridClass, 'factors()')
        if (this._factors === undefined || this._factors.length === 0) {
            log.trace(tag.gridClass, 'factors empty')
            this._factors = getClosestFactors(this.order.length) || [0, 0]
        }
        return this._factors
    }

    public setFactorWidth(width: number) {
        if (width <= 0) {
            this.regenFactors();
            return;
        }
        this._factors = [width, Math.ceil(this.order.length / width)];
        this.setSize(this.factors)
    }

    private regenFactors(): number[] {
        log.trace(tag.gridClass, 'regenFactors()')
        this._factors = getClosestFactors(this.order.length) || [0, 0]
        return this._factors
    }

    private generateCards(): void {
        log.trace(tag.gridClass, 'generateCards()')
        if (this.settings === undefined)
            return
        for (var combo of this.order) {
            var draw = SVG().addTo(this.canvas).size(`${this.cardSize.x}px`, `${this.cardSize.y}px`)
            var card = new CardSvg(draw, this.settings, combo.pip, combo.character, undefined, this.cardSize)
            card.drawCard()
            const value = `${combo.character.toLowerCase()}:${combo.pip}`
            this.cards[value] = card
        }
        return;
    }

    public setCardSize(width: number, height: number): void {
        this.cardSize = { x: width, y: height };
    }

    private setSize(factors?: number[]): void {
        log.trace(tag.gridClass, 'setSize()')
        const internalFactors = factors || this.regenFactors()
        const width = this.cardSize.x * internalFactors[0]
        const height = this.cardSize.y * internalFactors[1]
        log.trace(tag.gridClass, width)
        log.trace(tag.gridClass, height)
        this.canvas.size(`${width}px`, `${height}px`)
    }

    public setSettings(settings: CardSettings): void {
        this.settings = settings
    }

    public setOrder(order: PipCharacterCombo[], factors?: number[]): void {
        this.order = order
        this.setSize(factors)
    }

    public resetCards(): void {
        log.trace(tag.gridClass, 'resetCards()')
        this.canvas.clear()
        this.cards = {}
    }

    public redrawCards(): void {
        log.trace(tag.gridClass, 'drawCards()')
        if (this.settings === undefined)
            return
        this.resetCards()
        this.generateCards()
        var count = 0
        for (const combo of this.order) {
            const svg = this.cards[`${combo.character.toLowerCase()}:${combo.pip}`]
            // console.log('svg', svg);
            var x = count % this.factors[0]
            var y = (count - (x)) / this.factors[0]
            count++;
            log.trace(tag.gridClass, {x: x, y: y})
            var nested = this.canvas.nested()
            nested.size(this.cardSize.x, this.cardSize.y)
            nested.move(this.cardSize.x * x, this.cardSize.y * y)
            svg.canvas.addTo(nested);
            //nested.svg(svg.canvas.svg())
        }
        //$(`#${this.containerId}`).hide()
    }

    private get svgText(): string {
        const parent = this.canvas.parent();
        if (parent !== null) {
            this.canvas.flatten(parent, undefined);
            this.setSize(this.factors)
        }
        return `<svg width="${this.canvas.width()}px" height="${this.canvas.height()}px">>${this.canvas.defs().svg()}${this.canvas.svg()}</svg>`;
    }

    public async export(format: ImageFormat, individual: boolean = false): Promise<string[] | undefined> {
        if (individual) {
            let waitFor: Promise<string | undefined>[] = [];
            for (const card of Object.values(this.cards)) {
                waitFor.push(card.export(format));
            }
            let results = await Promise.all(waitFor);
            let output: string[] = [];
            for (const result of results) {
                if (result !== undefined) {
                    output.push(result);
                }
            }
            return output;
        } else {
            if (format === ImageFormatEnum.SVG) {
                return [this.svgText];
            } else {
                var canvas = await svgToCanvas(this.svgText);
                if (format === ImageFormatEnum.PNG) {
                    return [canvas.toDataURL('image/png')];
                } else {
                    return [canvas.toDataURL('image/jpeg')];
                }
            }
        }
    }

}