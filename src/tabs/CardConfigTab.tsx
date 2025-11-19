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
            <InputLabel id="characters-select-label">Characters</InputLabel>
            <Select
                labelId="characters-select-label"
                id="characters-select"
                multiple
                value={characters}
                onChange={handleCharacterChange}
                input={<OutlinedInput id="characters-select" label="Characters" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
            >
            {Characters.map((name) => (
                <MenuItem
                    key={name}
                    value={name} >
                    {name}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        <FormControl sx={{ width: 1 }}>
            <InputLabel id="suits-select-label">Suits</InputLabel>
            <Select
                labelId="suits-select-label"
                id="suits-select"
                multiple
                value={suits}
                onChange={handleSuitChange}
                input={<OutlinedInput id="suits-select" label="Suits" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
                        ))}
                    </Box>
                )}
            >
            {Suits.map((name) => (
                <MenuItem
                    key={name}
                    value={name} >
                    {name}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
    </>);
}
