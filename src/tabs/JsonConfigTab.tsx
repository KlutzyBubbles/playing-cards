import * as React from 'react';
import { FormControl, TextField } from '@mui/material';
import { log, tag } from 'missionlog';
import { CardSettingsContext } from '../providers/CardSettingProvider';
import { Validator } from 'jsonschema/lib';
import schema from '../../configs/schema.json';

export default function JsonConfigTab() {
    const { cardSettings, setCardSettings } = React.useContext(CardSettingsContext);
    const [cardSettingsString, setCardSettingsString] = React.useState<string>(JSON.stringify(cardSettings, undefined, 2));
    const [isJsonValid, setIsJsonValid] = React.useState<boolean>(true);

    const timeout = React.useRef<number | null>(null);

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
        }, 500);
        timeout.current = timer;
    }, [cardSettingsString])

    return (<>
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
    </>);
}
