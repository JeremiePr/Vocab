import { Importancy } from './importancy';

export interface GameItem
{
    wordId: number;
    value1: string;
    value2: string;
    importancy: Importancy;
}