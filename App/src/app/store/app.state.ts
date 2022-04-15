import { HttpErrorResponse } from '@angular/common/http';
import { Filter } from 'src/app/models/filter';
import { Word } from 'src/app/models/word';

export const appFeatureKey = 'app';

export interface AppState
{
    readonly words: ReadonlyArray<Word>;
    readonly filter: Filter;
    readonly isLoading: boolean;
    readonly error: HttpErrorResponse | null;
}