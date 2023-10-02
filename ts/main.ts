import $ from "jquery";
import * as M from 'materialize-css'
import { SVG } from '@svgdotjs/svg.js'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';
import {
    CardSettings,
    XY,
    PipType,
    PipCharacterCombo
} from "./types";
import { CardGrid } from "./classes/CardGrid";
import { CardSvg } from "./classes/CardSvg";

import * as standardConfig from '../configs/test/crazy.json'

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
    M.Tabs.init($('.tabs'), {});

    $('#json-config').val(JSON.stringify(testSettings, null, 4))
    M.textareaAutoResize($('#json-config'));

    M.FormSelect.init($('select'), {});
    
    var all = SVG().addTo('#all')
    var grid = new CardGrid(all, undefined, [], cardSize)

    $('#json-config-submit').on('click', (event) => {
        event.preventDefault()
        log.trace(tag.general, 'json-config-submit')
        log.trace(tag.general, $('#character-select').val())
        log.trace(tag.general, $('#suit-select').val())
        
        var order: PipCharacterCombo[] = []
        for (const character of <string[]>$('#character-select').val()) {
            for (const suit of <string[]>$('#suit-select').val()) {
                order.push({
                    pip: suit as PipType,
                    character: character
                })
            }
        }
        grid.setOrder(order)
        try {
            var settings = <CardSettings>JSON.parse(<string>$('#json-config').val())
            grid.setSettings(settings)
            grid.resetCards()
            grid.redrawCards()
        } catch (e) {
            log.error(tag.general, e)
            M.toast({html: 'Error redrawing cards, check json', classes: 'rounded red white-text'});
        }
    })
})
