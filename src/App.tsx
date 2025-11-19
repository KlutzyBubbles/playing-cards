import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
    AppBar,
    Toolbar,
    IconButton,
    Badge,
    Card,
    CardContent, 
    CardHeader,
    Tab,
    Tabs } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import './App.css';
import JsonConfigTab from './tabs/JsonConfigTab';
import { CustomTabPanel } from './tabs/Helper';
import PipTab from './tabs/PipTab';
import CardConfigTab from './tabs/CardConfigTab';
import ExportTab from './tabs/ExportTab';
import Copyright from './components/Copyright';
import CardPreviewCard from './components/CardPreviewCard';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function App() {
    const [currentTab, setCurrentTab] = React.useState<number>(0);

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
                    <CardHeader title="Cards Config" slotProps={{ title: { variant: 'h6' } }} />
                    <CardContent>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)} aria-label="basic tabs example">
                                <Tab label="JSON Config" {...a11yProps(0)} />
                                <Tab label="Pips" {...a11yProps(1)} />
                                <Tab label="Cards" {...a11yProps(2)} />
                                <Tab label="Export" {...a11yProps(3)} />
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
                            <ExportTab />
                        </CustomTabPanel>
                    </CardContent>
                </Card>
                <CardPreviewCard />
                <Copyright />
            </Box>
        </Container>
    </>);
}
