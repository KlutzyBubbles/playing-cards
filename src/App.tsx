import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { AppBar, Toolbar, IconButton, Badge, Button, Card, CardActions, CardContent, CardHeader, Tab, Tabs, Paper, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SelectChangeEvent, TextField, Grid, FormControlLabel, Switch } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import UpdateIcon from '@mui/icons-material/Update';
import DownloadIcon from '@mui/icons-material/Download';
import { Characters, type Character, CharacterEnum, type Suit, SuitEnum, Suits, type PipCharacterCombo, ImageFormatEnum, ImageFormats, type ImageFormat } from './types';
import * as standardConfig from '../configs/test/crazy.json';
import { log, tag } from 'missionlog';
import { CardSettingsContext } from './providers/CardSettingProvider';
import { CardGrid } from './classes/CardGrid';
import { SVG, Svg } from '@svgdotjs/svg.js';
import { cardSize } from './constants';
import { Validator } from 'jsonschema/lib';
import schema from '../configs/schema.json';
import './App.css';
import { Canvg } from 'canvg';

function Copyright() {
    return (
        <Typography
            variant="body2"
            align="center"
            sx={{
                color: 'text.secondary',
                mt: 4
            }}>
            {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
            Your Website
        </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


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
    var widthMatch = /<svg.+?(?=width=)width="(\d*)/gm
    var heightMatch = /<svg.+?(?=height=)height="(\d*)/gm

    var widths = [...svgText.matchAll(widthMatch)]
    var heights = [...svgText.matchAll(heightMatch)]

    var canvasWidth = parseFloat(widths[0][1])
    var canvasHeight = parseFloat(heights[0][1])

    var cardWidth = parseFloat(widths[1][1])
    var cardHeight = heights[1][1]

    const targetCardWidth = 1000
    var ratio = targetCardWidth / cardWidth
    var targetCanvasWidth = canvasWidth * ratio
    var targetCanvasHeight = canvasHeight * ratio

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

export default function App() {
    const { cardSettings, setCardSettings } = React.useContext(CardSettingsContext);
    const [currentTab, setCurrentTab] = React.useState<number>(0);
    const [cardSettingsString, setCardSettingsString] = React.useState<string>(JSON.stringify(cardSettings, undefined, 2));
    const [isJsonValid, setIsJsonValid] = React.useState<boolean>(true);
    const [isGridOutput, setIsGridOutput] = React.useState<boolean>(true);
    const [outputFormat, setOutputFormat] = React.useState<ImageFormat>(ImageFormatEnum.PNG);
    // const [jsonChange, setJsonChange] = React.useState<number>(0);
    const [characters, setCharacters] = React.useState<Character[]>([
        CharacterEnum.ACE,
        CharacterEnum.TWO,
        CharacterEnum.THREE,
        CharacterEnum.FOUR,
        CharacterEnum.FIVE,
        CharacterEnum.SIX,
        CharacterEnum.SEVEN,
        CharacterEnum.EIGHT,
        CharacterEnum.NINE,
        CharacterEnum.TEN,
        CharacterEnum.JACK,
        CharacterEnum.QUEEN,
        CharacterEnum.KING,
    ]);
    const [suits, setSuits] = React.useState<Suit[]>([
        SuitEnum.CLUB,
        SuitEnum.DIAMOND,
        SuitEnum.SPADE,
        SuitEnum.HEART,
    ]);
    const timeout = React.useRef<number | null>(null);
    // const grid = React.useRef<CardGrid>(null);
    const [grid, setGrid] = React.useState<CardGrid | null>(null);

    const SVGWrapperRefElement = React.useRef<HTMLDivElement>(null);
    const SVGContainer = React.useMemo(() => SVG(), []);

    const draw = () => {
        SVGContainer.add(SVG().rect(100, 100).fill("#f06"));
    };

    const clear = () => {
        SVGContainer.clear();
    };

    React.useEffect(() => {
        if (
            SVGWrapperRefElement &&
            SVGWrapperRefElement?.current &&
            SVGWrapperRefElement?.current?.children.length < 1
        ) {
            SVGContainer.addTo(SVGWrapperRefElement?.current);
        }
    }, [SVGWrapperRefElement, SVGContainer]);

    React.useEffect(() => {
        if (timeout.current !== null) {
            clearTimeout(timeout.current);
        }
        const timer = setTimeout(() => {
            try {
                const v = new Validator();
                const { $ref, ...temp } = schema;
                const result = v.validate(JSON.parse(cardSettingsString), temp, {
                    allowUnknownAttributes: true
                });
                setIsJsonValid(result.valid);
                if (result.valid) {
                    log.info(tag.general, 'settingCardSettings');
                    setCardSettings(JSON.parse(cardSettingsString));
                }
            } catch (e) { 
                log.warn(tag.general, 'Error processing cardSettingsString', e);
                setIsJsonValid(false);
            }
            // setJsonChange(jsonChange + 1);
        }, 500);
        timeout.current = timer;
    }, [cardSettingsString])

    /*
    React.useEffect(() => {
        if (isJsonValid) {
            log.info(tag.general, 'settingCardSettings');
            setCardSettings(JSON.parse(cardSettingsString));
        }
    }, [jsonChange]);
*/
    const handleCharacterChange = (event: SelectChangeEvent<typeof characters>) => {
        const {
            target: { value },
        } = event;
        setCharacters(
          // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') as Character[] : value,
        );
    };

    const handleSuitChange = (event: SelectChangeEvent<typeof suits>) => {
        const {
            target: { value },
        } = event;
        setSuits(
          // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') as Suit[] : value,
        );
    };

    const handleOutputFormatChange = (event: SelectChangeEvent<typeof outputFormat>) => {
        const {
            target: { value },
        } = event;
        setOutputFormat(value);
    };

    const updateCardsClick = () => {
        var order: PipCharacterCombo[] = []
        for (const character of characters) {
            for (const suit of suits) {
                order.push({
                    pip: suit,
                    character: character
                })
            }
        }
        // draw();
        setGrid(() => {
            let tempGrid = new CardGrid(SVG(), undefined, [], cardSize, [10, 6]);
            tempGrid.setOrder(order, [10, 6])
            try {
                // var settings = <CardSettings>JSON.psarse(<string>$('#json-config').val())
                SVGContainer.size(tempGrid.canvas.width(), tempGrid.canvas.height())
                SVGContainer.add(tempGrid.canvas)
                log.info(tag.general, 'cardSettings', cardSettings);
                tempGrid.setSettings(cardSettings)
                tempGrid.resetCards()
                tempGrid.redrawCards()
                console.log('test');
                // Toast.info('Test');
            } catch (e) {
                log.error(tag.general, e)
                // Toast.danger('Error', 'Error redrawing cards, check json');
                // new M.Toast({ text: 'Error redrawing cards, check json', classes: 'rounded red white-text' });
                return tempGrid;
            }
            return tempGrid;
        });
        /*
        grid.current = new CardGrid(SVG(), undefined, [], cardSize, [10, 6])
        grid.current.setOrder(order, [10, 6])
        try {
            // var settings = <CardSettings>JSON.psarse(<string>$('#json-config').val())
            SVGContainer.size(grid.current.canvas.width(), grid.current.canvas.height())
            SVGContainer.add(grid.current.canvas)
            log.info(tag.general, 'cardSettings', cardSettings);
            grid.current.setSettings(cardSettings)
            grid.current.resetCards()
            grid.current.redrawCards()
            console.log('test');
            // Toast.info('Test');
        } catch (e) {
            log.error(tag.general, e)
            // Toast.danger('Error', 'Error redrawing cards, check json');
            // new M.Toast({ text: 'Error redrawing cards, check json', classes: 'rounded red white-text' });
            return
        }
        */
        // drawn = true;
    }

    const downloadSVGClick = () => {
        log.trace(tag.general, 'cards-download')
        //const currentGrid = grid.current;
        if (grid !== null) {
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
            const svgExport = grid.export(ImageFormatEnum.SVG);
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
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}  >
                        Playing Cards
                    </Typography>
                    <IconButton href='https://github.com/KlutzyBubbles/playing-cards' size="large" aria-label="Github" color="inherit">
                        <Badge>
                            <GitHubIcon />
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Container maxWidth={false}>
        <Box sx={{ my: 4 }}>
            <Card sx={{ w: 1, mb: 2 }}>
                <CardHeader>
                    <Typography gutterBottom variant="h5" component="div">
                        Cards Config
                    </Typography>
                </CardHeader>
                <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)} aria-label="basic tabs example">
                            <Tab label="JSON Config" {...a11yProps(0)} />
                            <Tab label="Pips" {...a11yProps(1)} />
                            <Tab label="Cards" {...a11yProps(2)} />
                            <Tab label="Export Settings" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={currentTab} index={0}>
                        <FormControl sx={{ width: 1 }}>
                            <TextField
                                label="JSON Config"
                                id="json-config"
                                value={cardSettingsString}
                                onChange={(e) => setCardSettingsString(e.target.value)}
                                multiline
                                maxRows={20} />
                        </FormControl>
                        {isJsonValid ? 'Valid' : 'INVALID'}
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={1}>
                        <div className="tab-pane fade" id="corner-pips-config">Corner pip placeholder</div>
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={2}>
                        <FormControl sx={{ width: 1, mb: 2 }}>
                            <InputLabel id="character-select-label">Characters</InputLabel>
                            <Select
                                labelId="character-select-label"
                                id="character-select"
                                multiple
                                value={characters}
                                onChange={handleCharacterChange}
                                input={<OutlinedInput id="character-select" label="Characters" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                // MenuProps={MenuProps}
                            >
                            {Characters.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    // style={getStyles(name, personName, theme)}
                                >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ width: 1 }}>
                            <InputLabel id="suit-select-label">Suits</InputLabel>
                            <Select
                                labelId="suit-select-label"
                                id="suit-select"
                                multiple
                                value={suits}
                                onChange={handleSuitChange}
                                input={<OutlinedInput id="suit-select" label="Suits" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                                // MenuProps={MenuProps}
                            >
                            {Suits.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    // style={getStyles(name, personName, theme)}
                                >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={3}>
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
                    </CustomTabPanel>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={updateCardsClick}>
                        Update Cards <UpdateIcon />
                    </Button>
                    <Typography sx={{ flexGrow: 1 }} />
                    <Button size="small" onClick={downloadSVGClick} disabled={grid === null}>
                        Export <DownloadIcon />
                    </Button>
                </CardActions>
            </Card>
            <Paper>
                <div id="all" className="row left-align" ref={SVGWrapperRefElement}></div>
            </Paper>
            <Copyright />
        </Box>
    </Container></>);
}

/*

            <Paper>
                <div id="preview" className="row left-align"></div>
                <div id="all" className="row left-align" ref={SVGWrapperRefElement}></div>
                <div id="all2" className="row left-align" ref={(ref) => {
                    if (ref !== null)
                        test.current = SVG().addTo(ref);
                }}></div>
            </Paper>
*/
