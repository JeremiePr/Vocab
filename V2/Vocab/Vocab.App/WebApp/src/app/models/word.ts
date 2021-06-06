import { Importancy } from './importancy';

export interface Word {
    id: number;
    key: string;
    value: string;
    notes: string;
    importancy: Importancy;
}
