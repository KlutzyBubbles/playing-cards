import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Button,
    Card,
    CardActions,
    CardContent, 
    CardHeader,
    Tab,
    Tabs,
    Paper } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import UpdateIcon from '@mui/icons-material/Update';
import { type PipCharacterCombo } from './types';
import { log, tag } from 'missionlog';
import { CardSettingsContext } from './providers/CardSettingProvider';
import { CardGrid } from './classes/CardGrid';
import { SVG } from '@svgdotjs/svg.js';
import { cardSize } from './constants';
import './App.css';
import JsonConfigTab from './tabs/JsonConfigTab';
import { CustomTabPanel } from './tabs/Helper';
import PipTab from './tabs/PipTab';
import CardConfigTab from './tabs/CardConfigTab';
import ExportTab from './tabs/ExportTab';

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

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function App() {
    const { cardSettings, characters, suits } = React.useContext(CardSettingsContext);
    const [currentTab, setCurrentTab] = React.useState<number>(0);

    const [grid, setGrid] = React.useState<CardGrid | undefined>(undefined);

    const SVGWrapperRefElement = React.useRef<HTMLDivElement>(null);
    const SVGContainer = React.useMemo(() => SVG(), []);

    // SVGContainer.add(SVG().rect(100, 100).fill("#f06"));

    React.useEffect(() => {
        if (
            SVGWrapperRefElement &&
            SVGWrapperRefElement?.current &&
            SVGWrapperRefElement?.current?.children.length < 1
        ) {
            SVGContainer.addTo(SVGWrapperRefElement?.current);
        }
    }, [SVGWrapperRefElement, SVGContainer]);

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
                        <JsonConfigTab />
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={1}>
                        <PipTab />
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={2}>
                        <CardConfigTab />
                    </CustomTabPanel>
                    <CustomTabPanel value={currentTab} index={3}>
                        <ExportTab cardGrid={grid}/>
                    </CustomTabPanel>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={updateCardsClick}>
                        Update Cards <UpdateIcon />
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
