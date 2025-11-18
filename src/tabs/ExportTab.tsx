import * as React from 'react';
import { FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, Switch, type SelectChangeEvent, Button, Typography } from '@mui/material';
import { log, tag } from 'missionlog';
import { ImageFormats, type ImageFormat, ImageFormatEnum } from '../types';
import type { CardGrid } from '../classes/CardGrid';
import DownloadIcon from '@mui/icons-material/Download';
import { Canvg } from 'canvg';

function dataURLtoBlob(dataurl: string) {
    log.trace(tag.general, 'dataURLtoBlob(1)')
    log.trace(tag.general, dataurl)
    let arr = dataurl.split(',');
    let match = arr[0].match(/:(.*?);/);
    if (match === null) {
        throw new Error('match returned null');
    }
    let mime = match[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

async function downloadCanvas(svgText: string) {
    log.trace(tag.general, 'downloadCanvas(1)')
    var link = document.createElement("a");
    log.trace(tag.general, link)
    var canvas = await svgToCanvas(svgText)
    log.trace(tag.general, canvas)
    var imgData = canvas.toDataURL('image/png');
    // var strDataURI = imgData.substring(22, imgData.length);
    var blob = dataURLtoBlob(imgData);
    var objurl = URL.createObjectURL(blob);

    link.download = "helloWorld.png";

    link.href = objurl;

    link.click();
}

async function svgToCanvas(svgText: string) {
    log.trace(tag.general, 'svgToCanvas(1)')
    const canvas = document.createElement('canvas');
    log.trace(tag.general, canvas)
    if (canvas === null) {
        throw new Error('canvas null')
    }
    const ctx = canvas.getContext('2d');
    log.trace(tag.general, ctx)
    if (ctx === null) {
        throw new Error('ctx null')
    }
    log.trace(tag.general, svgText)
    //var widthMatch = /<svg.+?(?=width=)width="(\d*)/gm
    //var heightMatch = /<svg.+?(?=height=)height="(\d*)/gm

    //var widths = [...svgText.matchAll(widthMatch)]
    //var heights = [...svgText.matchAll(heightMatch)]

    //var canvasWidth = parseFloat(widths[0][1])
    //var canvasHeight = parseFloat(heights[0][1])

    //var cardWidth = parseFloat(widths[1][1])
    //var cardHeight = heights[1][1]

    //const targetCardWidth = 1000
    //var ratio = targetCardWidth / cardWidth
    //var targetCanvasWidth = canvasWidth * ratio
    //var targetCanvasHeight = canvasHeight * ratio

    //log.trace(tag.general, [...svgText.matchAll(widthMatch)])
    //log.trace(tag.general, [...svgText.matchAll(heightMatch)])

    //var width = parseInt(svgText.match(widthMatch)[1])
    //var height = parseInt(svgText.match(heightMatch)[1])



    var v = await Canvg.from(ctx, svgText);//, { scaleWidth: 5000, scaleHeight: 5000 });
    log.trace(tag.general, v)

    // v.resize(5000, 5000, 'xMidYMid slice')

    // Render only first frame?
    v.render()

    // Start SVG rendering with animations and mouse handling.
    // v.start();
    return canvas
}

interface ExportTabProps {
    cardGrid?: CardGrid
}

export default function ExportTab({
    cardGrid
}: ExportTabProps) {
    const [isGridOutput, setIsGridOutput] = React.useState<boolean>(true);
    const [outputFormat, setOutputFormat] = React.useState<ImageFormat>(ImageFormatEnum.PNG);

    const handleOutputFormatChange = (event: SelectChangeEvent<typeof outputFormat>) => {
        const {
            target: { value },
        } = event;
        setOutputFormat(value);
    };

    const exportClick = () => {
        log.trace(tag.general, 'cards-download')
        //const currentGrid = grid.current;
        if (cardGrid !== undefined) {
            /*
            var svg = grid.export()
            download('test.svg', svg)
            *

            svgToPng(grid.export('svg')).then((data) => {
                log.trace(tag.general, data)
                // download('test.png', data)
                // dataURIToBlob(data, 'test.png', callback);
                downloadCanvas(data)
            }).catch((e) => {
                log.error(tag.general, 'svgToPng catch')
                log.error(tag.general, e)
                M.toast({ html: 'Unknown error', classes: 'rounded red white-text' });
            })*/
            const svgExport = cardGrid.export(ImageFormatEnum.SVG);
            if (svgExport === undefined) {
                log.error(tag.general, 'Unable to export to svg');
                return;
            }
            downloadCanvas(svgExport).then((data) => {
                log.trace(tag.general, data)
                // download('test.png', data)
                // dataURIToBlob(data, 'test.png', callback);
            }).catch((e) => {
                log.error(tag.general, 'svgToPng catch')
                log.error(tag.general, e)
                // Toast.danger('Error', 'Unknown error');
                //new M.Toast({ text: 'Unknown error', classes: 'rounded red white-text' });
            })
        } else {
            log.error(tag.general, 'Make sure cards are drawn first')
            // Toast.danger('Error', 'Make sure cards are drawn first');
            //new M.Toast({ text: 'Make sure cards are drawn first', classes: 'rounded red white-text' });
        }
    }

    return (<>
        <Grid container spacing={2}>
            <Grid size={8}>
                <FormControl sx={{ width: 1 }}>
                    <InputLabel id="suit-select-label">Output Format</InputLabel>
                    <Select
                        labelId="output-format-select-label"
                        id="output-format-select"
                        value={outputFormat}
                        onChange={handleOutputFormatChange}
                        input={<OutlinedInput id="output-format-select" label="Output Format" />}
                        // renderValue={(selected) => (
                        //     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        //         {selected.map((value) => (
                        //             <Chip key={value} label={value} />
                        //         ))}
                        //     </Box>
                        // )}
                    >
                    {ImageFormats.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}>
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={4}>
                <FormControlLabel control={<Switch sx={{ m:2 }} defaultChecked onChange={(_, checked) => setIsGridOutput(checked)}/>} label={isGridOutput ? 'Grid' : 'Singles'} />
            </Grid>
        </Grid>
        <Typography sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={exportClick} disabled={cardGrid === undefined}>
            Export <DownloadIcon />
        </Button>
    </>);
}
