import $ from "jquery";
import * as M from 'materialize-css'
import { SVG } from '@svgdotjs/svg.js'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';
import {
    CardSettings,
    XY,
    PipType
} from "./types";
import { CardGrid } from "./classes/CardGrid";
import { CardSvg } from "./classes/CardSvg";

import * as standardConfig from '../configs/standard.json'

const logger = {
    [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
    [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
    [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.greenBright(tag)}]`, msg, ...params),
    [LogLevel.TRACE]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
    [LogLevel.DEBUG]: (tag, msg, params) => console.log(`[${chalk.magenta(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

log.init({ cardClass: 'card_class', gridClass: 'grid_class', general: 'general' }, (level, tag, msg, params) => {
    logger[level as keyof typeof logger](tag, msg, params);
});

var testSettings: CardSettings = standardConfig as CardSettings

const cardSize: XY = {
    x: 250,
    y: 350
}

interface CardStorage {
    [key: string]: CardSvg
}

$(() => {
    M.Collapsible.init($('.collapsible'), {});
    var characters = ['A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    // var characters = ['J', 'Q', 'K']
    var suits = {'c': 'club', 's': 'spade', 'h': 'heart', 'd': 'diamond'}
    //var suits = {'d': 'diamond', 'c': 'club'}

    var cards: CardStorage = {}

    var order: string[] = []

    for (var character of characters) {
        for (const [suitCharacter, suit] of Object.entries(suits)) {
            var draw = SVG().addTo(`#test`).size(`${cardSize.x}px`, `${cardSize.y}px`)
            var card = new CardSvg(draw, testSettings, suit as PipType, character)
            card.drawCard()
            const value = `${character.toLowerCase()}${suitCharacter}`
            cards[value] = card
            order.push(value)
        }
    }

    var all = SVG().addTo('#all')

    var grid = new CardGrid(all, cards, order)

    // $('#test').addClass('hide')
})
