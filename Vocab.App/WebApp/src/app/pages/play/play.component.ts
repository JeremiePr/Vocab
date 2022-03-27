import { Component, OnInit } from '@angular/core';
import { Word } from '../../models/word';
import { WordService } from '../../services/word.service';
import { GameItem } from '../../models/game-item';
import { Importancy } from '../../models/importancy';
import { Direction } from '../../models/direction';
import { ImportancyFilter } from '../../models/importancy-filter';
import { EventService } from '../../services/event.service';

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

const DIRECTIONS = [
    { value: 1, text: 'Normal' },
    { value: 2, text: 'Reversed' },
    { value: 3, text: 'Both directions' }
];

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.sass']
})
export class PlayComponent implements OnInit
{
    words: Array<Word> = [];
    gameItems: Array<GameItem> = [];
    importancyLevels = IMPORTANCY_LEVELS;
    importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;
    directions = DIRECTIONS;
    isReady = false;
    selectedImportancy = ImportancyFilter.HighOnly;
    selectedDirection = Direction.Normal;
    currentGameItemIndex = 0;
    isGameStarted = false;
    isGameItemRevealed = false;
    wordCount = 0;

    constructor(private wordService: WordService, private eventService: EventService) { }

    ngOnInit(): void
    {
        this.loadData();
    }

    loadData(): void
    {
        this.eventService.startProgressBarEvent.emit({ mode: 'indeterminate', value: 0 });
        this.wordService.get('')
            .subscribe(words =>
            {
                this.words = words;
                this.currentGameItemIndex = 0;
                this.isGameStarted = false;
                this.gameItems = [];
                this.isGameItemRevealed = false;
                this.onSelectedImportancyChange();
                this.eventService.stopProgressBarEvent.emit();
                this.isReady = true;
            });
    }

    generateWordsGame(): void
    {
        this.gameItems = [];
        const gameItems: Array<GameItem> = [];
        for (const word of this.words.filter(x => this.isWordMatchingImportancyFilter(x, this.selectedImportancy)))
        {
            switch (this.selectedDirection)
            {
                case Direction.Normal:
                    gameItems.push({ wordId: word.id, value1: word.key, value2: word.value, importancy: word.importancy });
                    break;
                case Direction.Reversed:
                    gameItems.push({ wordId: word.id, value1: word.value, value2: word.key, importancy: word.importancy });
                    break;
                case Direction.Both:
                    gameItems.push({ wordId: word.id, value1: word.key, value2: word.value, importancy: word.importancy });
                    gameItems.push({ wordId: word.id, value1: word.value, value2: word.key, importancy: word.importancy });
                    break;
                default:
                    throw new Error(`Value '${this.selectedDirection}' cannot be converted into enum type 'Direction'`);
            }
        }

        let n = gameItems.length;
        let i = 0;

        while (n > 0)
        {
            i = Math.floor(Math.random() * gameItems.length);
            if (i in gameItems)
            {
                this.gameItems.push(gameItems[i]);
                delete gameItems[i];
                n--;
            }
        }
    }

    onPlayClick(): void
    {
        this.currentGameItemIndex = 0;
        this.generateWordsGame();
        this.isGameStarted = true;
    }

    onLeaveClick(): void
    {
        this.loadData();
    }

    onNextClick(): void
    {
        this.isGameItemRevealed = false;
        this.currentGameItemIndex++;
        if (this.currentGameItemIndex === this.gameItems.length)
        {
            this.loadData();
        }
    }

    onWordImportancyChange(gameItem: GameItem): void
    {
        const word = this.words.filter(x => x.id === gameItem.wordId)[0];
        if (!word)
        {
            return;
        }
        const wordEdit: Word = { id: word.id, key: word.key, value: word.value, notes: word.notes, importancy: gameItem.importancy };
        this.wordService.update(wordEdit).subscribe();
    }

    onSelectedImportancyChange(): void
    {
        this.wordCount = this.words
            .filter(x => this.isWordMatchingImportancyFilter(x, this.selectedImportancy))
            .length;
    }

    isWordMatchingImportancyFilter(word: Word, referenceImportancy: ImportancyFilter): boolean
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
