import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from '../../services/word.service';
import { MatTableDataSource } from '@angular/material/table';
import { Importancy } from '../../models/importancy';
import { map, tap, switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

const DISPLAYED_COLUMNS = ['key', 'value', 'notes', 'importancy', 'actions'];
const IMPORTANCY_LEVELS = [{ value: 1, text: 'Low' }, { value: 2, text: 'Medium' }, { value: 3, text: 'High' }];
const IMPORTANCY_LEVELS_FILTERS = [{ value: 1, text: 'All' }, { value: 2, text: 'Medium / High' }, { value: 3, text: 'High only' }];

interface Row {
    word: Word;
    referenceFields: { key: string, value: string, notes: string, importancy: Importancy };
    index: number;
    isModified: boolean;
}

interface Filters {
    search: string;
    importancy: number;
}

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit, AfterViewInit {

    // @ViewChild(MatSort, { static: false }) set sort(sort: MatSort) {
    //     if (sort) {
    //         this.dataSource.sort = sort;
    //     }
    // }

    @ViewChild(MatSort) sort!: MatSort;

    dataSource = new MatTableDataSource<Row>();
    displayedColumns = DISPLAYED_COLUMNS;
    importancyLevels = IMPORTANCY_LEVELS;
    importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;
    focusedRowIndex = 0;
    focusedColumnName = '';
    isReady = false;
    filters: Filters = { search: '', importancy: 1 };
    wordCreate: Word = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High };

    constructor(private wordService: WordService) { }

    ngOnInit(): void {
        this.loadData();
    }

    ngAfterViewInit(): void {
        this.initDataSource();
    }

    initDataSource(): void {
        this.dataSource.filterPredicate = (row: Row, filtersString: string) => {
            const filters: Filters = { search: JSON.parse(filtersString).search, importancy: JSON.parse(filtersString).importancy };
            return (row.word.key.toLowerCase().includes(filters.search) || row.word.value.toLowerCase().includes(filters.search)) &&
                (row.word.importancy >= +filters.importancy);
        };
        this.dataSource.sort = this.sort;
        this.dataSource.sortData = (data: Array<Row>, sort: MatSort) => {
            let compareValue = 0;
            let column = sort.active;
            switch (sort.direction) {
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
            switch (column) {
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
    }

    loadData(): void {
        this.wordService.get('')
            .subscribe(words => {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
                this.isReady = true;
            });
    }

    onFilterChange(): void {
        this.dataSource.filter = JSON.stringify(this.filters);
        this.dataSource.paginator?.firstPage();
    }

    onCellHover(rowIndex: number, columnName: string): void {
        this.focusedRowIndex = rowIndex;
        this.focusedColumnName = columnName;
    }

    onResetClick(row: Row): void {
        row.word.key = row.referenceFields.key;
        row.word.value = row.referenceFields.value;
        row.word.notes = row.referenceFields.notes;
        row.word.importancy = row.referenceFields.importancy;
        row.isModified = false;
    }

    onAddClick(): void {
        this.wordService.create(this.wordCreate)
            .pipe(
                map(_ => this.wordCreate = { id: 0, key: '', value: '', notes: '', importancy: Importancy.High }),
                switchMap(() => this.wordService.get(''))
            )
            .subscribe(words => {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
            });
    }

    onSaveClick(row: Row): void {
        this.wordService.update(row.word)
            .pipe(
                tap(w => {
                    row.word.key = w.key;
                    row.word.value = w.value;
                    row.word.notes = w.notes;
                    row.word.importancy = w.importancy;
                    row.referenceFields = { key: w.key, value: w.value, notes: w.notes, importancy: w.importancy };
                    row.isModified = false;
                }),
                switchMap(() => this.wordService.get(''))
            )
            .subscribe(words => {
                this.dataSource.data = words.map((word: Word, index: number) => ({
                    word,
                    referenceFields: { key: word.key, value: word.value, notes: word.notes, importancy: word.importancy },
                    index,
                    isModified: false
                }));
                this.dataSource._updateChangeSubscription();
            });
    }

    onDeleteClick(row: Row): void {
        this.wordService.delete(row.word.id)
            .subscribe(() => {
                this.dataSource.data.splice(row.index, 1);
                this.dataSource._updateChangeSubscription();
            });
    }

    onRowChange(row: Row): void {
        const editWord = row.word;
        const ref = row.referenceFields;
        row.isModified = editWord.key !== ref.key || editWord.value !== ref.value || editWord.notes !== ref.notes || editWord.importancy !== ref.importancy;
    }

    onClearSearchClick(): void {
        this.filters = { search: '', importancy: 1 };
        this.onFilterChange();
    }

    onClearAddClick(): void {
        this.wordCreate.key = '';
        this.wordCreate.value = '';
        this.wordCreate.notes = '';
        this.wordCreate.importancy = Importancy.High;
    }

    isFiltersModified(): boolean {
        return this.filters.search !== '' || this.filters.importancy !== 1;
    }

    isWordCreateModified(): boolean {
        return this.wordCreate.key !== '' || this.wordCreate.value !== '' || this.wordCreate.notes !== '' || this.wordCreate.importancy !== Importancy.High;
    }

    isWordCreateValid(): boolean {
        return this.wordCreate.key !== '' && this.wordCreate.value !== ''
    }
}
