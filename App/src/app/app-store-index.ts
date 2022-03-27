import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { manageFeatureKey, manageReducer, ManageState } from 'src/app/pages/manage/store/manage.reducers';
import { playFeatureKey, playReducer, PlayState } from 'src/app/pages/play/store/play.reducers';
import { sharedFeatureKey, sharedReducer, SharedState } from 'src/app/shared/store/shared.reducers';

export const appFeatureKey = 'app';

export interface AppState
{
    [manageFeatureKey]: ManageState;
    [playFeatureKey]: PlayState;
    [sharedFeatureKey]: SharedState;
}

export const appReducers: ActionReducerMap<AppState> = {
    [manageFeatureKey]: manageReducer,
    [playFeatureKey]: playReducer,
    [sharedFeatureKey]: sharedReducer
};

export const appMetaReducers: MetaReducer<AppState>[] = [];