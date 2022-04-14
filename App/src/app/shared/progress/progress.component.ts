import { Component } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoading } from 'src/app/store/app.selectors';
import { AppState } from 'src/app/store/app.state';

@Component({
    selector: 'app-progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.sass']
})
export class ProgressComponent
{
    public readonly isLoading$: Observable<boolean>;

    public constructor(
        private readonly _store: Store<AppState>
    )
    {
        this.isLoading$ = this._store.pipe(
            select(selectIsLoading)
        );
    }
}
