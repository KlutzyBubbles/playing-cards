import * as React from 'react';
import { FormControl, FormControlLabel, Grid, InputLabel, MenuItem, OutlinedInput, Select, Switch, type SelectChangeEvent, Button, Typography } from '@mui/material';
import { log, tag } from 'missionlog';
import { ImageFormats, type ImageFormat, ImageFormatEnum, type PipCharacterCombo } from '../types';
import { CardGrid } from '../classes/CardGrid';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import { CardSettingsContext } from '../providers/CardSettingProvider';
import { SVG } from '@svgdotjs/svg.js';
import { cardSize } from '../constants';
import NumberField from '../components/NumberField';

function dataURLtoBlob(dataurl: string) {
    log.trace(tag.general, 'dataURLtoBlob(1)', dataurl)
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

export default function ExportTab() {
    const { enqueueSnackbar } = useSnackbar();
    const { characters, suits, cardSettings } = React.useContext(CardSettingsContext);
    const [isGridOutput, setIsGridOutput] = React.useState<boolean>(true);
    const [outputFormat, setOutputFormat] = React.useState<ImageFormat>(ImageFormatEnum.PNG);
    const [gridOptions, setGridOptions] = React.useState<number[]>([]);
    const [gridWidth, setGridWidth] = React.useState<string>('10');
    const [cardWidth, setCardWidth] = React.useState<number>(cardSize.x);
    const [cardHeight, setCardHeight] = React.useState<number>(cardSize.y);
    const [grid, setGrid] = React.useState<CardGrid | undefined>(undefined);

    const isExporting = React.useRef<boolean>(false);
    const SVGWrapperRefElement = React.useRef<HTMLDivElement>(null);
    const SVGContainer = React.useMemo(() => SVG(), []);

    React.useEffect(() => {
        log.info(tag.general, 'SVGwarpper');
        if (
            SVGWrapperRefElement &&
            SVGWrapperRefElement?.current &&
            SVGWrapperRefElement?.current?.children.length < 1
        ) {
            SVGContainer.addTo(SVGWrapperRefElement?.current);
        }
    }, [SVGWrapperRefElement, SVGContainer]);

    React.useEffect(() => {
        const total = characters.length * suits.length;
        setGridOptions(Array.from({ length: total }, (_, i) => i + 1))
    }, [characters, suits]);

    React.useEffect(() => {
        if (gridWidth !== '') {
            const gridWidthNumber = parseInt(gridWidth);
            if (!gridOptions.includes(gridWidthNumber)) {
                if (gridOptions.length < 10) {
                    if (gridOptions.length === 0) {
                        setGridWidth('');
                    } else {
                        setGridWidth(`${gridOptions[gridOptions.length - 1]}`);
                    }
                } else {
                    setGridWidth('10');
                }
            }
        } else {
            if (gridOptions.length < 10) {
                if (gridOptions.length === 0) {
                    setGridWidth('');
                } else {
                    setGridWidth(`${gridOptions[gridOptions.length - 1]}`);
                }
            } else {
                setGridWidth('10');
            }
        }
    }, [gridOptions, gridWidth])

    const handleOutputFormatChange = (event: SelectChangeEvent<typeof outputFormat>) => {
        const {
            target: { value },
        } = event;
        setOutputFormat(value);
    };

    const handleGridWidthChange = (event: SelectChangeEvent<typeof gridWidth>) => {
        const {
            target: { value },
        } = event;
        setGridWidth(value);
    };

    const exportGrid = async (cardGrid: CardGrid) => {
        log.trace(tag.general, 'exportGrid');
        try {
            let allResults = await cardGrid.export(outputFormat, !isGridOutput) ?? [];
            for (let imgData of allResults) {
                if (imgData === undefined) {
                    log.error(tag.general, 'Unable to export to svg');
                    return;
                }
                
                var link = document.createElement("a");
                log.trace(tag.general, link)
                if (outputFormat === ImageFormatEnum.SVG) {
                    imgData = '<?xml version="1.0" standalone="no"?>\r\n' + imgData;
                    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(imgData);
                    link.href = url;
                } else {
                    var blob = dataURLtoBlob(imgData);
                    var objurl = URL.createObjectURL(blob);
                    link.href = objurl;
                }
                link.download = `output.${outputFormat}`;
                link.click();
            }
            SVGContainer.size(0, 0);
            SVGContainer.clear();
            enqueueSnackbar('Exported', { variant: 'success' });
        } catch (e) {
            log.error(tag.general, e);
            enqueueSnackbar('Unknown error', { variant: 'error' });
        }
    }

    const exportClick = async () => {
        log.trace(tag.general, 'cards-download');
        if (isExporting.current) {
            return;
        }
        isExporting.current = true;
        const timeout = setTimeout(() => { isExporting.current = false; }, 30000);
        var order: PipCharacterCombo[] = []
        for (const character of characters) {
            for (const suit of suits) {
                order.push({
                    pip: suit,
                    character: character
                })
            }
        }
        if (grid === undefined) {
            setGrid((prevGrid) => {
                let tempGrid = prevGrid || new CardGrid(SVG(), undefined, []);
                try {
                    tempGrid.setCardSize(cardWidth, cardHeight);
                    tempGrid.setOrder(order);
                    tempGrid.setFactorWidth(parseInt(gridWidth || '0'));
                    tempGrid.setSettings(cardSettings);
                    SVGContainer.size(tempGrid.canvas.width(), tempGrid.canvas.height());
                    SVGContainer.clear();
                    SVGContainer.add(tempGrid.canvas);
                    tempGrid.redrawCards();
                    exportGrid(tempGrid);
                } catch (e) {
                    log.error(tag.general, 'Error rendering grid 1', e);
                } finally {
                    clearTimeout(timeout);
                    isExporting.current = false;
                    return tempGrid;
                }
            });
        } else {
            try {
                grid.setCardSize(cardWidth, cardHeight);
                grid.setOrder(order);
                grid.setFactorWidth(parseInt(gridWidth || '0'));
                grid.setSettings(cardSettings);
                SVGContainer.size(grid.canvas.width(), grid.canvas.height());
                SVGContainer.clear();
                SVGContainer.add(grid.canvas);
                grid.resetCards();
                grid.redrawCards();
                exportGrid(grid);
            } catch (e) {
                log.error(tag.general, 'Error rendering grid 2', e);
            } finally {
                clearTimeout(timeout);
                isExporting.current = false;
            }
        }
    };

    return (<>
        <Grid container spacing={2}>
            <Grid size={6}>
                <FormControl sx={{ width: 1 }}>
                    <InputLabel id="output-format-select-label">Output Format</InputLabel>
                    <Select
                        labelId="output-format-select-label"
                        id="output-format-select"
                        value={outputFormat}
                        onChange={handleOutputFormatChange}
                        input={<OutlinedInput id="output-format-select" label="Output Format" />}>
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
            <Grid size={3}>
                <FormControlLabel
                    control={<Switch sx={{ w: 1, m: 2 }}
                    defaultChecked
                    onChange={(_, checked) => setIsGridOutput(checked)}/>}
                    label={isGridOutput ? 'Grid' : 'Singles'} />
            </Grid>
            <Grid size={3}>
                <FormControl sx={{ width: 1 }}>
                    <InputLabel id="grid-width-select-label">Grid Width</InputLabel>
                    <Select
                        labelId="grid-width-select-label"
                        id="grid-width-select"
                        disabled={!isGridOutput}
                        value={`${gridWidth}`}
                        onChange={handleGridWidthChange}
                        input={<OutlinedInput id="grid-width-select" label="Grid Width" />}>
                    {gridOptions.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}>
                        {name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        <Typography variant='h6' sx={{ mb: 2 }}>
            Card Size
        </Typography>
        <Grid container spacing={2}>
            <Grid size={6}>
                <FormControl sx={{ width: 1 }}>
                    <NumberField
                        label="Width (px)"
                        value={cardWidth}
                        onValueChange={(value) => setCardWidth(Math.abs(value ?? 0))}
                        min={0}
                        max={10000} />
                </FormControl>
            </Grid>
            <Grid size={6}>
                <FormControl sx={{ width: 1 }}>
                    <NumberField
                        label="Height (px)"
                        value={cardHeight}
                        onValueChange={(value) => setCardHeight(Math.abs(value ?? 0))}
                        min={0}
                        max={10000} />
                </FormControl>
            </Grid>
        </Grid>
        <Button sx={{ width: 1, mt: 2 }} variant="contained" size="large" onClick={exportClick}>
            Export <DownloadIcon />
        </Button>
        <div id="export-preview" className="row left-align" ref={SVGWrapperRefElement}></div>
    </>);
}
