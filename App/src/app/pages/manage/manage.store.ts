import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { ValueText } from 'src/app/pages/manage/manage.models';
import { filterEmptyArray } from 'src/app/shared/pipes/app-pipes';

export interface ManageState
{
    readonly displayedColumns: Array<string>;
    readonly importancyLevels: Array<ValueText>;
    readonly importancyLevelsFilters: Array<ValueText>;
}

const initialState: ManageState =
{
    displayedColumns: [
        'key',
        'value',
        'notes',
        'importancy',
        'actions'
    ],
    importancyLevels: [
        { value: 1, text: 'Low' },
        { value: 2, text: 'Medium' },
        { value: 3, text: 'High' }
    ],
    importancyLevelsFilters: [
        { value: 1, text: 'All' },
        { value: 2, text: 'Medium / High' },
        { value: 3, text: 'High only' },
        { value: 4, text: 'Medium only' },
        { value: 5, text: 'Low only' }
    ]
};

@Injectable()
export class ManageStore extends ComponentStore<ManageState>
{
    public readonly displayedColumns$: Observable<Array<string>>;
    public readonly importancyLevels$: Observable<Array<ValueText>>;
    public readonly importancyLevelsFilters$: Observable<Array<ValueText>>;

    public constructor()
    {
        super(initialState);

        this.displayedColumns$ = this.select(state => state.displayedColumns);

        this.importancyLevels$ = this.select(state => state.importancyLevels);

        this.importancyLevelsFilters$ = this.select(state => state.importancyLevelsFilters);
    }
}