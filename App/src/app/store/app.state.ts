import { HttpErrorResponse } from '@angular/common/http';
import { Word } from 'src/app/models/word';

export const appFeatureKey = 'app';

export interface AppState
{
    readonly words: ReadonlyArray<Word>;
    readonly search: string;
    readonly isLoading: boolean;
    readonly error: HttpErrorResponse | null;
}
