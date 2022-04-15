import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { ImportancyFilter } from 'src/app/models/importancy-filter';
import { Word } from 'src/app/models/word';

const actionPrefix = '[App]';

export const getWords = createAction(
    `${actionPrefix} Get Words`,
    props<{ search: string }>()
);

export const getWordsSuccess = createAction(
    `${actionPrefix} Get Words Success`,
    props<{ words: Array<Word> }>()
);

export const getWordsFailure = createAction(
    `${actionPrefix} Get Words Failure`,
    props<{ error: HttpErrorResponse }>()
);

export const getOneWordById = createAction(
    `${actionPrefix} Get One Word By Id`,
    props<{ id: number }>()
);

export const getOneWordByIdSuccess = createAction(
    `${actionPrefix} Get One Word By Id Success`,
    props<{ word?: Word }>()
);

export const getOneWordByIdFailure = createAction(
    `${actionPrefix} Get One Word By Id Failure`,
    props<{ error: HttpErrorResponse }>()
);

export const createWord = createAction(
    `${actionPrefix} Create Word`,
    props<{ word: Word }>()
);

export const createWordSuccess = createAction(
    `${actionPrefix} Create Word Success`,
    props<{ words: Array<Word> }>()
);

export const createWordFailure = createAction(
    `${actionPrefix} Create Word Failure`,
    props<{ error: HttpErrorResponse }>()
);

export const updateWord = createAction(
    `${actionPrefix} Update Word`,
    props<{ word: Word }>()
);

export const updateWordSuccess = createAction(
    `${actionPrefix} Update Word Success`,
    props<{ words: Array<Word> }>()
);

export const updateWordFailure = createAction(
    `${actionPrefix} Update Word Failure`,
    props<{ error: HttpErrorResponse }>()
);

export const deleteWord = createAction(
    `${actionPrefix} Delete Word`,
    props<{ id: number }>()
);

export const deleteWordSuccess = createAction(
    `${actionPrefix} Delete Word Success`,
    props<{ words: Array<Word> }>()
);

export const deleteWordFailure = createAction(
    `${actionPrefix} Delete Word Failure`,
    props<{ error: HttpErrorResponse }>()
);

export const setFilter = createAction(
    `${actionPrefix} Set Filter`,
    props<{ search: string, importancy: ImportancyFilter }>()
);

export const clearFilter = createAction(
    `${actionPrefix} Clear Filter`
);

export const clear = createAction(
    `${actionPrefix} Clear`
);