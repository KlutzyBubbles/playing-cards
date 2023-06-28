// import * as Materialize from 'materialize-css'
// import 'materialize-css/dist/js/materialize.min.js'
console.log('yay')

import $ from "jquery";
import * as M from 'materialize-css'
import { SVG } from '@svgdotjs/svg.js'

import { log, LogLevel, tag } from 'missionlog';
import chalk from 'chalk';
import {
    CardSettings,
    CornerPipLocation,
    XY,
    PipType,
    PipLocationName,
    CenterPipLayout
} from "./types";
import { CardGrid } from "./classes/CardGrid";
import { CardSvg } from "./classes/CardSvg";

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

var testSettings: CardSettings = {
    outlineAffectsPosition: true,
    background: {
        all: {
            enabled: true,
            outline: {
                enabled: false,
                width: 10
            },
            color: "#FFF",
            radius: 12,
        },
        heart: {
            enabled: true,
            outline: {
                enabled: true,
                width: 10
            },
            color: "#000",
            radius: 12,
        }
    },
    defaultColors: {
        club: '#000',
        spade: '#000',
        heart: '#F00',
        diamond: '#F00',
        red: '#F00',
        black: '#000',
        all: '#000'
    },
    center: {
        all: {
            background: {
                enabled: false,
                outline: {
                    enabled: true,
                    color: '#00F',
                    width: 2
                },
                color: "#FFF",
                width: 150,
                height: 200,
                paddingX: 50,
                paddingY: 75,
                radius: 5,
            },
            pips: {
                enabled: true,
                width: 50,
                location: PipLocationName.Symmetrical,
                locationScale: 1
            },
            face: {
                enabled: true,
                color: [
                    "#FC4",
                    "#FC4",
                    "#FC4",
                    "#F00",
                    "#F00",
                    "#F00",
                    "#44F",
                    "#44F",
                    "#44F",
                    "#000",
                    "#000",
                    "#000",
                    "#F00",
                    "#F00",
                    "#F00",
                    "#44F",
                    "#44F",
                    "#44F"
                ],
                width: 150,
                height: 250,
                paddingX: 50,
                paddingY: 50
            }
        },
        club: {
            background: {
                enabled: true,
                outline: {
                    enabled: true,
                    color: '#00F',
                    width: 2
                },
                color: "#FFF",
                width: 150,
                height: 250,
                paddingX: 50,
                paddingY: 50,
                radius: 5,
            },
            pips: {
                enabled: true,
                width: 25,
                location: PipLocationName.SymmetricalAlt,
                locationScale: 0.5
            }
        },
        diamond: {
            pips: {
                enabled: true,
                width: 50,
                location: PipLocationName.Standard,
                locationScale: 1,
                outline: {
                    enabled: true,
                    color: '#000',
                    width: 1
                },
            }
        },
        spade: {
            pips: {
                enabled: true,
                width: 50,
                location: PipLocationName.Symmetrical,
                locationScale: 1,
                outline: {
                    enabled: true,
                    color: '#00F',
                    width: 1
                },
            }
        }
    },
    cornerPips: [
        {
            all: {
                enabled: true,
                location: CornerPipLocation.TopLeft,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 21.5,
                    centerPadX: true
                },
                pip: {
                    enabled: true,
                    width: 23,
                    height: 30,
                    paddingY: 50,
                    paddingX: 10,
                }
            },
            club: {
                enabled: true,
                location: CornerPipLocation.TopLeft,
                character: {
                    enabled: true,
                    fontSize: 25
                },
                pip: {
                    enabled: true,
                    height: 25,
                    outline: {
                        enabled: true,
                        color: '#00F',
                        width: 1
                    },
                }
            },
            black: {
                enabled: true,
                location: CornerPipLocation.TopLeft,
                character: {
                    enabled: true,
                    fontSize: 25
                },
                pip: {
                    enabled: true,
                    height: 25,
                    color: '#FFF',
                    outline: {
                        enabled: true,
                        color: '#0F0',
                        width: 1
                    },
                }
            }
        },
        {
            all: {
                enabled: true,
                location: CornerPipLocation.BottomRight,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 21.5,
                    centerPadX: true
                },
                pip: {
                    enabled: true,
                    width: 23,
                    height: 30,
                    paddingY: 50,
                    paddingX: 10,
                }
            },
            club: {
                enabled: true,
                location: CornerPipLocation.BottomRight,
                character: {
                    enabled: true,
                    fontSize: 25
                },
                pip: {
                    enabled: true,
                    height: 25,
                }
            }
        },
        {
            all: {
                enabled: false,
                location: CornerPipLocation.TopRight,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 22.5,
                    centerPadX: true,
                    color: '#0F0'
                },
                pip: {
                    enabled: true,
                    width: 25,
                    paddingY: 50,
                    paddingX: 10,
                }
            }
        },
        {
            all: {
                enabled: false,
                location: CornerPipLocation.BottomLeft,
                character: {
                    enabled: true,
                    fontSize: 25,
                    paddingY: 10,
                    paddingX: 22.5,
                    centerPadX: true
                },
                pip: {
                    enabled: true,
                    width: 25,
                    paddingY: 50,
                    paddingX: 10,
                }
            }
        }
    ]
}

const cardSize: XY = {
    x: 250,
    y: 350
}

interface CardStorage {
    [key: string]: CardSvg
}

$(() => {
    M.Collapsible.init($('.collapsible'), {});
    // var draw = SVG().addTo('#example-card').size(`${cardSize.x}px`, `${cardSize.y}px`)

    // var test = SVG().addTo('#test').size(`${cardSize.x}px`, `${cardSize.y}px`)
    // test.rect(cardSize.x, cardSize.y).fill('#FFF').move(0, 0)

    var characters = ['A', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    //var characters = ['J']
    var suits = {'c': 'club', 's': 'spade', 'h': 'heart', 'd': 'diamond'}
    //var suits = {'d': 'diamond', 'c': 'club'}

    var cards: CardStorage = {}

    var order: string[] = []

    for (var character of characters) {
        for (const [suitCharacter, suit] of Object.entries(suits)) {
            //var draw = SVG().addTo(`#${suitCharacter}${character.toLowerCase()}`).size(`${cardSize.x}px`, `${cardSize.y}px`)
            var draw = SVG().addTo(`#all`).size(`${cardSize.x}px`, `${cardSize.y}px`)
            var card = new CardSvg(draw, testSettings, suit as PipType, character)
            card.drawCard()
            const value = `${character.toLowerCase()}${suitCharacter}`
            cards[value] = card
            order.push(value)
        }
    }

    var all = SVG().addTo('#all')

    var grid = new CardGrid(all, cards, order)
    // var card = new CardSvg(draw, testSettings, 'spade', '0')
})
