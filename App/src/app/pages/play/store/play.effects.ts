import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { WordService } from 'src/app/services/word.service';

@Injectable()
export class PlayEffects
{

    public constructor(private _action$: Actions, private _wordService: WordService) { }
}