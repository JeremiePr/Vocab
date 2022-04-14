import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { WordService } from 'src/app/services/word.service';
import * as fromActions from 'src/app/store/app.actions';

@Injectable()
export class AppEffects
{
    public readonly getWords$ = createEffect(() => this._action$.pipe(
        ofType(fromActions.getWords),
        switchMap(action => this._wordService.get(action.search).pipe(
            map(words => fromActions.getWordsSuccess({ words })),
            catchError(error => of(fromActions.getWordsFailure({ error })))
        ))
    ));

    public readonly getOneWordById$ = createEffect(() => this._action$.pipe(
        ofType(fromActions.getOneWordById),
        switchMap(action => this._wordService.getOneById(action.id).pipe(
            map(word => fromActions.getOneWordByIdSuccess({ word })),
            catchError(error => of(fromActions.getOneWordByIdFailure({ error })))
        ))
    ));

    public readonly createWord$ = createEffect(() => this._action$.pipe(
        ofType(fromActions.createWord),
        switchMap(action => this._wordService.create(action.word).pipe(
            switchMap(_ => this._wordService.get('')),
            map(words => fromActions.createWordSuccess({ words })),
            catchError(error => of(fromActions.createWordFailure({ error })))
        ))
    ));

    public readonly updateWord$ = createEffect(() => this._action$.pipe(
        ofType(fromActions.updateWord),
        switchMap(action => this._wordService.update(action.word).pipe(
            switchMap(_ => this._wordService.get('')),
            map(words => fromActions.updateWordSuccess({ words })),
            catchError(error => of(fromActions.updateWordFailure({ error })))
        ))
    ));

    public readonly deleteWord$ = createEffect(() => this._action$.pipe(
        ofType(fromActions.deleteWord),
        switchMap(action => this._wordService.delete(action.id).pipe(
            switchMap(_ => this._wordService.get('')),
            map(words => fromActions.deleteWordSuccess({ words })),
            catchError(error => of(fromActions.deleteWordFailure({ error })))
        ))
    ))

    public constructor(
        private _action$: Actions,
        private _wordService: WordService) { }
}