import { Importancy } from 'src/app/models/importancy';
import { Word } from 'src/app/models/word';

export interface Row
{
    word: Word;
    referenceFields: { key: string, value: string, notes: string, importancy: Importancy };
    index: number;
    isModified: boolean;
}

export interface ValueText
{
    value: number;
    text: string;
}