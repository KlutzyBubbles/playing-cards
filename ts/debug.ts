console.log('debug')
import $ from "jquery";
import * as M from 'materialize-css'
import { SVG, Svg, Box } from '@svgdotjs/svg.js'
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


$(() => {
    var canvas = SVG().addTo(`#test`).size(`500px`, `500px`)
    var group = canvas.group()

    // Add rotate point if exists
    var pathString = 'm 173.92537,266.48092 1.12914,-1.20818 -2.41691,-2.25775 -1.12862,1.2082'
    var rotatePath = group.path(pathString)
    group.add(rotatePath)
    // rotX = rotatePath.bbox().w
    // rotY = rotatePath.bbox().h
    console.log('rotatePath before')
    console.log(rotatePath.bbox().w)
    console.log(rotatePath.bbox().h)
    console.log(rotatePath.bbox().x)
    console.log(rotatePath.bbox().y)
    group.size(150, undefined)
    group.move(10, 10)
    drawBBox(canvas, rotatePath.rbox(canvas))
    console.log('rotatePath')
    console.log(rotatePath.bbox().w)
    console.log(rotatePath.bbox().h)
    console.log(rotatePath.bbox().x)
    console.log(rotatePath.bbox().y)
    console.log('rotatePath rbox')
    console.log(rotatePath.rbox().w)
    console.log(rotatePath.rbox().h)
    console.log(rotatePath.rbox().x)
    console.log(rotatePath.rbox().y)
    var rotX = rotatePath.rbox().x + (rotatePath.rbox().w / 2)
    var rotY = rotatePath.rbox().y + (rotatePath.rbox().h / 2)
    //group.removeElement(rotatePath)
    canvas.add(group)
})



function drawBBox(canvas: Svg, bbox: Box) {
    drawDebug(canvas, bbox.x, bbox.y, bbox.width, bbox.height)
}

function drawDebug(canvas: Svg, x: number, y: number, width: number, height: number) {
    var rect = canvas.rect(width, height)
    rect.move(x, y)
    rect.fill('none')
    rect.stroke({
        width: 1,
        color: '#F00'
    })
}
