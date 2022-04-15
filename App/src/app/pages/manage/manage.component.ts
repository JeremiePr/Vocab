import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Filter } from 'src/app/models/filter';
import { clearFilter, createWord, deleteWord, getWords, setFilter, updateWord } from 'src/app/store/app.actions';
import { selectFilter, selectIsLoading, selectWords } from 'src/app/store/app.selectors';
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

    public readonly filter$: Observable<Filter>;
    public readonly words$: Observable<ReadonlyArray<Word>>;
    public readonly isLoading$: Observable<boolean>;

    public readonly dataSource = new MatTableDataSource<Row>();
    public readonly displayedColumns = DISPLAYED_COLUMNS;
    public readonly importancyLevels = IMPORTANCY_LEVELS;
    public readonly importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;

    public readonly filterForm = new FormGroup({
        search: new FormControl(''),
        importancy: new FormControl(ImportancyFilter.All)
    });

    public readonly createForm = new FormGroup({
        key: new FormControl(''),
        value: new FormControl(''),
        notes: new FormControl(''),
        importancy: new FormControl(Importancy.High)
    });

    private _currentEditionRow: Row | null = null;

    public constructor(
        private readonly _store: Store<AppState>)
    {
        this._store.dispatch(getWords({ search: '' }));

        this.filter$ = this._store.pipe(
            select(selectFilter)
        );

        this.words$ = this._store.pipe(
            select(selectWords),
            withLatestFrom(this.filter$),
            tap(([words, filter]) =>
            {
                this.dataSource.data = words
                    .filter(word => word.key.toLowerCase().includes(filter.search) || word.value.toLowerCase().includes(filter.search))
                    .filter(word => this.isWordMatchingImportancyFilter(word, filter.importancy))
                    .filter(word => word.importancy)
                    .map((word: Word, index: number) => ({
                        word,
                        referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                        index,
                        isModified: false
                    }));
                this.dataSource._updateChangeSubscription();
            }),
            map(([words, _]) => words)
        );

        this.isLoading$ = this._store.pipe(
            select(selectIsLoading)
        );
    }

    public ngAfterViewInit(): void
    {
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

    public onFilterChange(): void
    {
        this._store.dispatch(setFilter({
            search: this.filterForm.controls['search'].value.toLowerCase(),
            importancy: this.filterForm.controls['importancy'].value
        }));
    }

    public onSearchClick(): void
    {
        this._store.dispatch(setFilter({
            search: this.filterForm.controls['search'].value.toLowerCase(),
            importancy: this.filterForm.controls['importancy'].value
        }));
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
        const key = this.createForm.controls['key'].value;
        const value = this.createForm.controls['value'].value;
        const notes = this.createForm.controls['notes'].value;
        const importancy = this.createForm.controls['importancy'].value;

        this._store.dispatch(createWord({ word: { id: 0, key, value, notes, importancy } }));
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
        this.filterForm.controls['search'].setValue('');
        this.filterForm.controls['importancy'].setValue(ImportancyFilter.All);
        this._store.dispatch(clearFilter());
    }

    public onClearAddClick(): void
    {
        this.createForm.controls['key'].setValue('');
        this.createForm.controls['value'].setValue('');
        this.createForm.controls['notes'].setValue('');
        this.createForm.controls['importancy'].setValue(Importancy.High);
    }

    public isFiltersModified(): boolean
    {
        const searchValue = this.filterForm.controls['search'].value.toLowerCase();
        const importancyValue = this.filterForm.controls['importancy'].value;
        return searchValue !== '' || importancyValue !== DEFAULT_IMPORTANCY_LEVEL_FILTER;
    }

    public isWordCreateModified(): boolean
    {
        const key = this.createForm.controls['key'].value;
        const value = this.createForm.controls['value'].value;
        const notes = this.createForm.controls['notes'].value;
        const importancy = this.createForm.controls['importancy'].value;

        return key !== '' || value !== '' || notes !== '' || importancy !== Importancy.High;
    }

    public isWordCreateValid(): boolean
    {
        const key = this.createForm.controls['key'].value;
        const value = this.createForm.controls['value'].value;

        return key !== '' && value !== '';
    }

    public isWordValid(word: Word): boolean
    {
        return word.key !== '' && word.value !== '';
    }

    private isWordMatchingImportancyFilter(word: Word, referenceImportancy: ImportancyFilter): boolean
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
