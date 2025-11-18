import * as React from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SelectChangeEvent } from '@mui/material';
import { CardSettingsContext } from '../providers/CardSettingProvider';
import { Characters, Suits, type Character, type Suit } from '../types';

export default function CardConfigTab() {
    const { characters, setCharacters, suits, setSuits } = React.useContext(CardSettingsContext);

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

    return (<>
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
    </>);
}
