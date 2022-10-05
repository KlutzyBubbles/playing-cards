// import * as Materialize from 'materialize-css'
// import 'materialize-css/dist/js/materialize.min.js'
console.log('yay')

import $ from "jquery";
import * as M from 'materialize-css'
import { SVG } from '@svgdotjs/svg.js'
import clubsSvg from './svg/club.svg'
import clubsSvgPath from './svg/club.path'

$(() => {
    M.Collapsible.init($('.collapsible'), {});

    var draw = SVG().addTo('#example-card').size('250px', '350px')

    var clubsPath = 'm 50.291466,22.698228 c 0,0 2.375,-1.9 2.375,-4.534 0,-1.542 -1.369,-4.102 -4.534,-4.102 -3.165,0 -4.534,2.561 -4.534,4.102 0,2.634 2.375,4.534 2.375,4.534 -2.638,-2.055 -7.341,-0.652 -7.341,3.455 0,2.056 1.68,4.318 4.318,4.318 3.165,0 4.534,-3.455 4.534,-3.455 0,0 0.402,3.938 -1.943,6.046 h 5.182 c -2.345,-2.107 -1.943,-6.046 -1.943,-6.046 0,0 1.369,3.455 4.534,3.455 2.639,0 4.318,-2.263 4.318,-4.318 0,-4.107 -4.703,-5.51 -7.341,-3.455 z'
    var clubsGroup = '<g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1"><g id="use65" transform="matrix(0.27175119,0,0,0.27175128,126.77642,135.0577)"><path d="m 30,150 c 5,235 55,250 100,350 H -130 C -85,400 -35,385 -30,150 a 10,10 0 0 0 -20,0 210,210 0 1 1 -74,-201 10,10 0 0 0 14,-14 230,230 0 1 1 220,0 10,10 0 0 0 14,14 210,210 0 1 1 -74,201 10,10 0 0 0 -20,0 z" fill="#000000" id="path1024"></path></g></g>'
    var path = draw.path(clubsPath)
    path.fill('#000000')//.move(0, 0)
    path.x(50)
    path.y(50)
    path.size('1', '1')
    console.log(path.transform())
    path.transform({
        rotate: 0,
        //translateX: 50,
        //translateY: 50,
        scale: 10
    })
    //path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })

    // console.log(clubsSvg)
    // var svg = draw.svg(clubsSvgPath)
    // svg.transform({
    //     rotate: 0,
    //     translateX: 50,
    //     translateY: 50,
    //     scale: 0.1
    // })
    //var rect = draw.rect(100, 100).attr({ fill: '#f06' })
})