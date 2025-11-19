import { type FC, type ReactNode, createContext, useState } from 'react';
import { CharacterEnum, type CardSettings, type Character, SuitEnum, type Suit } from '../types';
import { predefinedSettings } from '../constants';

const defaultCharacters = [
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
];

const defaultSuits = [
    SuitEnum.CLUB,
    SuitEnum.DIAMOND,
    SuitEnum.SPADE,
    SuitEnum.HEART,
]

export const CardSettingsContext = createContext<{
    cardSettings: CardSettings,
    setCardSettings: (cardSettings: CardSettings) => void,
    characters: Character[],
    setCharacters: (characters: Character[]) => void,
    suits: Suit[],
    setSuits: (suits: Suit[]) => void,
        }>({
            cardSettings: predefinedSettings.standard,
            setCardSettings: (cardSettings: CardSettings) => { console.log('DEFAULT STILL RUN', cardSettings); },
            characters: defaultCharacters,
            setCharacters: (characters: Character[]) => { console.log('DEFAULT STILL RUN', characters); },
            suits: defaultSuits,
            setSuits: (suits: Suit[]) => { console.log('DEFAULT STILL RUN', suits); }
        });

interface CardSettingsProviderProps {
    children?: ReactNode
}

export const CardSettingsProvider: FC<CardSettingsProviderProps> = ({
    children
}) => {
    const [cardSettings, setCardSettings] = useState<CardSettings>(predefinedSettings.standard);
    const [characters, setCharacters] = useState<Character[]>(defaultCharacters);
    const [suits, setSuits] = useState<Suit[]>(defaultSuits);

    return (
        <CardSettingsContext.Provider
            value={{
                cardSettings,
                setCardSettings,
                characters,
                setCharacters,
                suits,
                setSuits
            }}
        >
            {children}
        </CardSettingsContext.Provider>
    );
};
