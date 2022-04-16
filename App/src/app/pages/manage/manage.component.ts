import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Filter } from 'src/app/models/filter';
import { Row, ValueText } from 'src/app/pages/manage/manage.models';
import { ManageStore } from 'src/app/pages/manage/manage.store';
import { clearFilter, createWord, deleteWord, getWords, setFilter, updateWord } from 'src/app/store/app.actions';
import { selectFilter, selectIsLoading, selectWords } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';
import { Importancy } from '../../models/importancy';
import { ImportancyFilter } from '../../models/importancy-filter';
import { Word } from '../../models/word';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.sass'],
    providers: [ManageStore]
})
export class ManageComponent implements AfterViewInit
{
    @ViewChild(MatSort) public readonly sort: MatSort | null = null;
    @ViewChild(MatPaginator) public readonly paginator: MatPaginator | null = null;
    @ViewChild('inputCreateKey') public readonly inputCreateKey: ElementRef | null = null;

    public readonly filter$: Observable<Filter>;
    public readonly words$: Observable<ReadonlyArray<Word>>;
    public readonly isLoading$: Observable<boolean>;
    public readonly displayedColumns$: Observable<Array<string>>;
    public readonly importancyLevels$: Observable<Array<ValueText>>;
    public readonly importancyLevelsFilters$: Observable<Array<ValueText>>;

    public readonly dataSource = new MatTableDataSource<Row>();
    public readonly filterForm: FormGroup;
    public readonly createForm: FormGroup;

    private _currentEditionRow: Row | null = null;

    public constructor(
        private readonly _appStore: Store<AppState>,
        private readonly _componentStore: ManageStore)
    {
        this._appStore.dispatch(getWords({ search: '' }));

        this.filterForm = new FormGroup({
            search: new FormControl(''),
            importancy: new FormControl(ImportancyFilter.All)
        });

        this.createForm = new FormGroup({
            key: new FormControl(''),
            value: new FormControl(''),
            notes: new FormControl(''),
            importancy: new FormControl(Importancy.High)
        });

        this.filter$ = this._appStore.pipe(
            select(selectFilter)
        );

        this.words$ = this._appStore.pipe(
            select(selectWords),
            withLatestFrom(this.filter$),
            tap(([words, filter]) => this.buildDataSource(words, filter)),
            map(([words, _]) => words)
        );

        this.isLoading$ = this._appStore.pipe(
            select(selectIsLoading)
        );

        this.displayedColumns$ = this._componentStore.displayedColumns$;

        this.importancyLevels$ = this._componentStore.importancyLevels$;

        this.importancyLevelsFilters$ = this._componentStore.importancyLevelsFilters$;
    }

    public ngAfterViewInit(): void
    {
        this.initializeDataSource();
    }

    public onFilterChange(): void
    {
        this._appStore.dispatch(setFilter({
            search: this.filterForm.controls['search'].value.toLowerCase(),
            importancy: this.filterForm.controls['importancy'].value
        }));
    }

    public onSearchClick(): void
    {
        this._appStore.dispatch(setFilter({
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

        this._appStore.dispatch(createWord({ word: { id: 0, key, value, notes, importancy } }));
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
        this._appStore.dispatch(updateWord({ word: row.word }));
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
        this._appStore.dispatch(deleteWord({ id: row.word.id }));
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
        this._appStore.dispatch(clearFilter());
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
        return searchValue !== '' || importancyValue !== ImportancyFilter.All;
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

    private initializeDataSource(): void
    {
        this.dataSource.filterPredicate = this.filterDataSourceFn.bind(this);
        this.dataSource.sortData = this.sortDataSourceFn.bind(this);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    private filterDataSourceFn(row: Row, filtersString: string): boolean
    {
        if (this._currentEditionRow) this.onResetClick(this._currentEditionRow);

        const filters: Filter = { search: JSON.parse(filtersString).search, importancy: JSON.parse(filtersString).importancy };

        return (row.word.key.toLowerCase().includes(filters.search) || row.word.value.toLowerCase().includes(filters.search)) &&
            this.isWordMatchingImportancyFilter(row.word, +filters.importancy);
    }

    private sortDataSourceFn(data: Array<Row>, sort: MatSort): Array<Row>
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

    private buildDataSource(words: ReadonlyArray<Word>, filter: Filter): void
    {
        this.dataSource.data = words
            // .filter(word => word.key.toLowerCase().includes(filter.search) || word.value.toLowerCase().includes(filter.search))
            // .filter(word => this.isWordMatchingImportancyFilter(word, filter.importancy))
            // .filter(word => word.importancy)
            .map((word: Word, index: number) => ({
                word,
                referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                index,
                isModified: false
            }));
        this.dataSource._updateChangeSubscription();
        this.dataSource.filter = JSON.stringify(filter);
        this.dataSource.paginator?.firstPage();
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
