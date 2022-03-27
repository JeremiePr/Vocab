import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Word } from '../../models/word';
import { WordService } from '../../services/word.service';
import { MatTableDataSource } from '@angular/material/table';
import { Importancy } from '../../models/importancy';
import { tap, switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { EventService } from '../../services/event.service';
import { MatPaginator } from '@angular/material/paginator';
import { ImportancyFilter } from '../../models/importancy-filter';

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
export class ManageComponent implements OnInit, AfterViewInit
{
    @ViewChild(MatSort) public readonly sort: MatSort | null = null;
    @ViewChild(MatPaginator) public readonly paginator: MatPaginator | null = null;
    @ViewChild('inputCreateKey') public readonly inputCreateKey: ElementRef | null = null;

    public readonly dataSource = new MatTableDataSource<Row>();
    public readonly displayedColumns = DISPLAYED_COLUMNS;
    public readonly importancyLevels = IMPORTANCY_LEVELS;
    public readonly importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;

    public isReady = false;
    public isLoading = false;
    public filters: Filters = { search: '', importancy: DEFAULT_IMPORTANCY_LEVEL_FILTER };
    public wordCreate: Word = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High };

    private _currentEditionRow: Row | null = null;

    public constructor(
        private readonly _wordService: WordService,
        private readonly _eventService: EventService) { }

    public ngOnInit(): void
    {
        this.loadData();
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

    public loadData(): void
    {
        this.isLoading = true;
        this._eventService.startProgressBarEvent.emit({ mode: 'indeterminate', value: 0 });
        this._wordService.get('')
            .subscribe(words =>
            {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
                this._eventService.stopProgressBarEvent.emit();
                this.onFilterChange();
                this.isReady = true;
                this.isLoading = false;
            });
    }

    public onFilterChange(): void
    {
        this.dataSource.filter = JSON.stringify(this.filters);
        this.dataSource.paginator?.firstPage();
    }

    public onSearchClick(): void
    {
        this.loadData();
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
        this._eventService.startProgressBarEvent.emit({ mode: 'indeterminate', value: 0 });
        this._wordService.create(this.wordCreate)
            .pipe(
                tap(_ => this.wordCreate = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High }),
                switchMap(_ => this._wordService.get(''))
            )
            .subscribe(words =>
            {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
                this._eventService.stopProgressBarEvent.emit();
                this.inputCreateKey?.nativeElement.focus();
            });
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
        this._eventService.startProgressBarEvent.emit({ mode: 'indeterminate', value: 0 });
        this._wordService.update(row.word)
            .pipe(
                tap(w =>
                {
                    row.word.key = w.key;
                    row.word.value = w.value;
                    row.word.notes = w.notes;
                    row.word.importancy = w.importancy;
                    row.referenceFields = { key: w.key, value: w.value, notes: w.notes, importancy: w.importancy };
                    row.isModified = false;
                    this._currentEditionRow = null;
                }),
                switchMap(() => this._wordService.get(''))
            )
            .subscribe(words =>
            {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
                this._eventService.stopProgressBarEvent.emit();
            });
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
        this._eventService.startProgressBarEvent.emit({ mode: 'indeterminate', value: 0 });
        this._wordService.delete(row.word.id)
            .pipe(
                switchMap(() => this._wordService.get(''))
            )
            .subscribe(words =>
            {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
                this._eventService.stopProgressBarEvent.emit();
            });
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
        this.filters = { search: '', importancy: DEFAULT_IMPORTANCY_LEVEL_FILTER };
        this.onFilterChange();
    }

    public onClearAddClick(): void
    {
        this.wordCreate.key = '';
        this.wordCreate.value = '';
        this.wordCreate.notes = '';
        this.wordCreate.importancy = Importancy.High;
    }

    public isFiltersModified(): boolean
    {
        return this.filters.search !== '' || this.filters.importancy !== DEFAULT_IMPORTANCY_LEVEL_FILTER;
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
