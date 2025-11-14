import { type FC, type ReactNode, createContext, useState } from 'react';
import defaultConfig from '../../configs/test/crazy.json'
import type { CardSettings } from '../types';

export const CardSettingsContext = createContext<{
    cardSettings: CardSettings,
    setCardSettings: (cardSettings: CardSettings) => void,
        }>({
            cardSettings: defaultConfig as CardSettings,
            setCardSettings: (cardSettings: CardSettings) => { console.log('DEFAULT STILL RUN', cardSettings); }
        });

interface CardSettingsProviderProps {
    children?: ReactNode
}

export const CardSettingsProvider: FC<CardSettingsProviderProps> = ({
    children
}) => {
    const [cardSettings, setCardSettings] = useState<CardSettings>(defaultConfig as CardSettings);

    return (
        <CardSettingsContext.Provider
            value={{
                cardSettings,
                setCardSettings
            }}
        >
            {children}
        </CardSettingsContext.Provider>
    );
};
