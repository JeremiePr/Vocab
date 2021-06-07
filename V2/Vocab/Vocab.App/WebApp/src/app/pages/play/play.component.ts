import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/models/word';
import { WordService } from '../../services/word.service';
import { GameItem } from '../../models/game-item';

const IMPORTANCY_LEVELS = [{ value: 1, text: 'Low' }, { value: 2, text: 'Medium' }, { value: 3, text: 'High' }];
const IMPORTANCY_LEVELS_FILTERS = [{ value: 1, text: 'All' }, { value: 2, text: 'Medium / High' }, { value: 3, text: 'High only' }];
const DIRECTIONS = [{ value: 1, text: 'Normal' }, { value: 2, text: 'Reversed' }, { value: 3, text: 'Both directions' }];

enum Direction {
    Normal = 1,
    Reversed = 2,
    Both = 3
}

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.sass']
})
export class PlayComponent implements OnInit {

    words: Array<Word> = [];
    gameItems: Array<GameItem> = [];
    importancyLevels = IMPORTANCY_LEVELS;
    importancyLevelsFilters = IMPORTANCY_LEVELS_FILTERS;
    directions = DIRECTIONS;
    isReady = false;
    selectedImportancy = 3;
    selectedDirection = Direction.Normal;
    currentGameItemIndex = 0;
    isGameStarted = false;
    isGameItemRevealed = false;

    constructor(private wordService: WordService) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.wordService.get('')
            .subscribe(words => {
                this.words = words;
                this.isReady = true;
            });
    }

    getWordCount(): number {
        return this.words.filter(x => x.importancy >= this.selectedImportancy).length;
    }

    generateWordsGame(): void {
        this.gameItems = [];
        const gameItems: Array<GameItem> = [];
        for (const word of this.words.filter(x => x.importancy >= this.selectedImportancy)) {
            switch (this.selectedDirection) {
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

        while (n > 0) {
            i = Math.floor(Math.random() * gameItems.length);
            if (i in gameItems) {
                this.gameItems.push(gameItems[i]);
                delete gameItems[i];
                n--;
            }
        }
    }

    onPlayClick(): void {
        this.currentGameItemIndex = 0;
        this.generateWordsGame();
        this.isGameStarted = true;
    }

    onLeaveClick(): void {
        this.currentGameItemIndex = 0;
        this.isGameStarted = false;
        this.gameItems = [];
    }

    onNextClick(): void {
        this.isGameItemRevealed = false;
        this.currentGameItemIndex++;
        if (this.currentGameItemIndex === this.gameItems.length) {
            this.currentGameItemIndex = 0;
            this.isGameStarted = false;
            this.gameItems = [];
        }
    }

    onWordImportancyChange(gameItem: GameItem): void {
        const word = this.words.filter(x => x.id === gameItem.wordId)[0];
        if (!word) {
            return;
        }
        word.importancy = gameItem.importancy;
        this.wordService.update(word).subscribe();
    }
}
