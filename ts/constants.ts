import * as standardPipLocations from './pipLocations/standard.json'
import * as symetricalPipLocations from './pipLocations/symetrical.json'
import * as symetricalAltPipLocations from './pipLocations/symetrical_alt.json'

import {
    XY,
    CenterPipLayout
} from "./types";

export const pipOptions = {
    'club': [
        'm 30,150 c 5,235 55,250 100,350 H -130 C -85,400 -35,385 -30,150 a 10,10 0 0 0 -20,0 210,210 0 1 1 -74,-201 10,10 0 0 0 14,-14 230,230 0 1 1 220,0 10,10 0 0 0 14,14 210,210 0 1 1 -74,201 10,10 0 0 0 -20,0 z'
    ],
    'spade': [
        'M0 -500C100 -250 355 -100 355 185A150 150 0 0 1 55 185A10 10 0 0 0 35 185C35 385 85 400 130 500L-130 500C-85 400 -35 385 -35 185A10 10 0 0 0 -55 185A150 150 0 0 1 -355 185C-355 -100 -100 -250 0 -500Z'
    ],
    'heart': [
        'M0 -300C0 -400 100 -500 200 -500C300 -500 400 -400 400 -250C400 0 0 400 0 500C0 400 -400 0 -400 -250C-400 -400 -300 -500 -200 -500C-100 -500 0 -400 -0 -300Z'
    ],
    'diamond': [
        'M -400,0 C -350,0 0,-450 0,-500 0,-450 350,0 400,0 350,0 0,450 0,500 0,450 -350,0 -400,0 Z'
    ]
}

export const pipLocations: CenterPipLayout[] = [
    standardPipLocations,
    symetricalPipLocations,
    symetricalAltPipLocations
]

export const cardSize: XY = {
    x: 250,
    y: 350
}
