import { ImportancyFilter } from 'src/app/models/importancy-filter';

export interface Filter
{
    readonly search: string;
    readonly importancy: ImportancyFilter;
}