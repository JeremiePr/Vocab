import { MetaReducer, ActionReducerMap } from '@ngrx/store';
import { appReducer } from 'src/app/store/app.reducers';
import { AppState, appFeatureKey } from 'src/app/store/app.state';

export const appMetaReducers: MetaReducer<AppState>[] = [];

export interface IndexState
{
    [appFeatureKey]: AppState
}

export const appReducers: ActionReducerMap<IndexState> = {
    [appFeatureKey]: appReducer
};
