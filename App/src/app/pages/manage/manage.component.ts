import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { createWord, deleteWord, getWords, setSearch, updateWord } from 'src/app/store/app.actions';
import { selectIsLoading, selectSearch, selectWords } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';
import { Importancy } from '../../models/importancy';
import { ImportancyFilter } from '../../models/importancy-filter';
import { Word } from '../../models/word';

const IMPORTANCY_LEVELS = [
    { value: 1, text: 'Low' },
    { value: 2, text: 'Medium' },
    { value: 3, text: 'High' }
];

const IMPORTANCY_LEVELS_FILTERS = [
    { value: 1, text: 'All' },
    { value: 2, text: 'Medium / High' },
    { value: 3, text: 'High only' },
    { value: 4, text: 'Medium only' },
    { value: 5, text: 'Low only' }
];

const DISPLAYED_COLUMNS = ['key', 'value', 'notes', 'importancy', 'actions'];

const DEFAULT_IMPORTANCY_LEVEL_FILTER = ImportancyFilter.All;

interface Row
{
    word: Word;
    referenceFields: { key: string, value: string, notes: string, importancy: Importancy };
    index: number;
    isModified: boolean;
}

interface Filters
{
    search: string;
    importancy: ImportancyFilter;
}

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements AfterViewInit
{
    @ViewChild(MatSort) public readonly sort: MatSort | null = null;
    @ViewChild(MatPaginator) public readonly paginator: MatPaginator | null = null;
    @ViewChild('inputCreateKey') public readonly inputCreateKey: ElementRef | null = null;

    public readonly search$: Observable<string>;
    public readonly words$: Observable<ReadonlyArray<Word>>;
    public readonly isLoading$: Observable<boolean>;

    public readonly dataSource = new MatTableDataSource<Row>();
    public readonly displayedColumns = DISPLAYED_COLUMNS;
    public readonly importancyLevels = IMPORTANCY_LEVELS;
    public readonly importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;

    public isReady = false;
    public importancy = DEFAULT_IMPORTANCY_LEVEL_FILTER;
    public wordCreate: Word = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High };

    private _currentEditionRow: Row | null = null;

    public constructor(
        private readonly _store: Store<AppState>)
    {
        this._store.dispatch(getWords({ search: '' }));

        this.search$ = this._store.pipe(
            select(selectSearch),
            map(search => search.toLowerCase())
        );

        this.words$ = this._store.pipe(
            select(selectWords),
            withLatestFrom(this.search$),
            map(([words, search]) =>
            {
                this.dataSource.data = words
                    .filter(word => word.key.toLowerCase().includes(search) || word.value.toLowerCase().includes(search))
                    .map((word: Word, index: number) => ({
                        word,
                        referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                        index,
                        isModified: false
                    }));
                this.dataSource._updateChangeSubscription();
                this.wordCreate = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High }

                return words;
            })
        );

        this.isLoading$ = this._store.pipe(
            select(selectIsLoading)
        );
    }

    public ngAfterViewInit(): void
    {
        this.initDataSource();
    }

    public initDataSource(): void
    {
        this.dataSource.filterPredicate = (row: Row, filtersString: string) =>
        {
            if (this._currentEditionRow)
            {
                this.onResetClick(this._currentEditionRow);
            }
            const filters: Filters = { search: JSON.parse(filtersString).search, importancy: JSON.parse(filtersString).importancy };
            return (row.word.key.toLowerCase().includes(filters.search) || row.word.value.toLowerCase().includes(filters.search)) &&
                this.isWordMatchingImportancyFilter(row.word, +filters.importancy);
        };
        this.dataSource.sort = this.sort;
        this.dataSource.sortData = (data: Array<Row>, sort: MatSort) =>
        {
            let compareValue = 0;
            let column = sort.active;
            switch (sort.direction)
            {
                case 'asc':
                    compareValue = 1;
                    break;
                case 'desc':
                    compareValue = -1;
                    break;
                default:
                    column = 'importancy';
                    compareValue = -1;
                    break;
            }
            switch (column)
            {
                case 'key':
                    return data.sort((a, b) => a.word.key.toLowerCase() > b.word.key.toLowerCase() ? compareValue : -compareValue);
                case 'value':
                    return data.sort((a, b) => a.word.value.toLowerCase() > b.word.value.toLowerCase() ? compareValue : -compareValue);
                case 'importancy':
                    return data.sort((a, b) => a.word.importancy > b.word.importancy ? compareValue : -compareValue);
                default:
                    return data;
            }
        }
        this.dataSource.paginator = this.paginator;
    }

    public onFilterChange(element: HTMLInputElement): void
    {
        this._store.dispatch(setSearch({ search: element.value }));
    }

    public onSearchClick(element: HTMLInputElement): void
    {
        this._store.dispatch(setSearch({ search: element.value }));
    }

    public onResetClick(row: Row): void
    {
        row.word.key = row.referenceFields.key;
        row.word.value = row.referenceFields.value;
        row.word.notes = row.referenceFields.notes;
        row.word.importancy = row.referenceFields.importancy;
        row.isModified = false;
        this._currentEditionRow = null;
    }

    public onAddClick(): void
    {
        this._store.dispatch(createWord({ word: this.wordCreate }));
        this.inputCreateKey?.nativeElement.focus();
    }

    public onEnterAddKeyPress(): void
    {
        if (this.isWordCreateValid())
        {
            this.onAddClick();
        }
    }

    public onSaveClick(row: Row): void
    {
        this._store.dispatch(updateWord({ word: row.word }));
    }

    public onEnterSaveKeyPress(row: Row): void
    {
        if (this.isWordValid(row.word))
        {
            this.onSaveClick(row);
        }
    }

    public onDeleteClick(row: Row): void
    {
        this._store.dispatch(deleteWord({ id: row.word.id }));
    }

    public onRowChange(row: Row): void
    {
        const editWord = row.word;
        const ref = row.referenceFields;
        row.isModified = editWord.key !== ref.key || editWord.value !== ref.value || editWord.notes !== ref.notes || editWord.importancy !== ref.importancy;
        if (this._currentEditionRow && row !== this._currentEditionRow)
        {
            this.onResetClick(this._currentEditionRow);
        }
        if (row.isModified)
        {
            this._currentEditionRow = row;
        }
    }

    public onClearSearchClick(): void
    {
        this._store.dispatch(setSearch({ search: '' }))
        this.importancy = DEFAULT_IMPORTANCY_LEVEL_FILTER;
    }

    public onClearAddClick(): void
    {
        this.wordCreate.key = '';
        this.wordCreate.value = '';
        this.wordCreate.notes = '';
        this.wordCreate.importancy = Importancy.High;
    }

    public isFiltersModified(search: string): boolean
    {
        return search !== '' || this.importancy !== DEFAULT_IMPORTANCY_LEVEL_FILTER;
    }

    public isWordCreateModified(): boolean
    {
        return this.wordCreate.key !== '' || this.wordCreate.value !== '' || this.wordCreate.notes !== '' || this.wordCreate.importancy !== Importancy.High;
    }

    public isWordCreateValid(): boolean
    {
        return this.wordCreate.key !== '' && this.wordCreate.value !== '';
    }

    public isWordValid(word: Word): boolean
    {
        return word.key !== '' && word.value !== '';
    }

    public isWordMatchingImportancyFilter(word: Word, referenceImportancy: ImportancyFilter): boolean
    {
        switch (referenceImportancy)
        {
            case ImportancyFilter.All: return true;
            case ImportancyFilter.MediumHigh: return word.importancy >= Importancy.Medium;
            case ImportancyFilter.HighOnly: return word.importancy === Importancy.High;
            case ImportancyFilter.MediumOnly: return word.importancy === Importancy.Medium;
            case ImportancyFilter.LowOnly: return word.importancy === Importancy.Low;
            default: return true
        }
    }
}
