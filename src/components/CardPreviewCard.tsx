import * as React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select } from '@mui/material';
import { log, tag } from 'missionlog';
import { type Character, type Suit, CharacterEnum, SuitEnum } from '../types';
import { CardSettingsContext } from '../providers/CardSettingProvider';
import { SVG } from '@svgdotjs/svg.js';
import { CardPreview } from '../classes/CardPreview';

export default function CardPreviewCard() {
    const { characters, suits, cardSettings } = React.useContext(CardSettingsContext);
    const [character, setCharacter] = React.useState<Character>(CharacterEnum.ACE);
    const [suit, setSuit] = React.useState<Suit>(SuitEnum.SPADE);
    const [preview, setPreview] = React.useState<CardPreview | undefined>(undefined);
    const SVGWrapperRefElement = React.useRef<HTMLDivElement>(null);
    const SVGContainer = React.useMemo(() => SVG(), []);

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
        log.info(tag.general, '4 Use effect');
        if (preview === undefined) {
            setPreview((prevPreview) => {
                let tempPreview = prevPreview || new CardPreview(SVG(), cardSettings, { pip: suit, character: character });
                //try {
                //    SVGContainer.size(tempPreview.canvas.width(), tempPreview.canvas.height());
                //    SVGContainer.add(tempPreview.canvas);
                //} catch (e) {
                //    log.error(tag.general, 'Error rendering preview', e);
                //} finally {
                    return tempPreview;
                //}
            });
            return;
        }
        try {
            SVGContainer.size(preview.canvas.width(), preview.canvas.height());
            SVGContainer.clear();
            SVGContainer.add(preview.canvas);
            preview.setCombo({ pip: suit, character: character });
            preview.setSettings(cardSettings);
            preview.redraw();
        } catch (e) {
            log.error(tag.general, 'Error rendering preview', e);
        }
    }, [cardSettings, suit, character, preview]);

    React.useEffect(() => {
        log.info(tag.general, '2 Use effect');
        if (!characters.includes(character)) {
            if (characters.length > 0) {
                setCharacter(characters[0]);
            } else {
                setCharacter(CharacterEnum.ACE);
            }
        }
        if (!suits.includes(suit)) {
            if (suits.length > 0) {
                setSuit(suits[0]);
            } else {
                setSuit(SuitEnum.SPADE);
            }
        }
    }, [suits, characters]);

    return (<Card sx={{ w: 1, mb: 2 }}>
        <CardHeader title="Card Preview" slotProps={{ title: { variant: 'h6' } }} />
        <CardContent>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <FormControl sx={{ width: 1, mb: 2 }}>
                        <InputLabel id="character-select-label">Character</InputLabel>
                        <Select
                            labelId="character-select-label"
                            id="character-select"
                            value={character}
                            onChange={(e) => setCharacter(e.target.value)}
                            input={<OutlinedInput id="character-select" label="Character" />}
                        >
                        {characters.map((name) => (
                            <MenuItem
                                key={name}
                                value={name} >
                                {name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl sx={{ width: 1 }}>
                        <InputLabel id="suit-select-label">Suit</InputLabel>
                        <Select
                            labelId="suit-select-label"
                            id="suit-select"
                            value={suit}
                            onChange={(e) => setSuit(e.target.value)}
                            input={<OutlinedInput id="suit-select" label="Suit" />}
                        >
                        {suits.map((name) => (
                            <MenuItem
                                key={name}
                                value={name} >
                                {name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <div id="card-preview" className="row left-align" ref={SVGWrapperRefElement}></div>
        </CardContent>
    </Card>
    );
}