import { createFeatureSelector, createSelector } from '@ngrx/store';
import { appFeatureKey, AppState } from 'src/app/store/app.state';

const selectState = createSelector(createFeatureSelector<AppState>(appFeatureKey), state => state);

export const selectWords = createSelector(
    selectState,
    (state: AppState) => state.words
);

export const selectFilter = createSelector(
    selectState,
    (state: AppState) => state.filter
);

export const selectIsLoading = createSelector(
    selectState,
    (state: AppState) => state.isLoading
);

export const selectError = createSelector(
    selectState,
    (state: AppState) => state.error
);