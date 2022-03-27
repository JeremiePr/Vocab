import { createFeatureSelector, createSelector } from '@ngrx/store';
import { sharedFeatureKey, SharedState } from 'src/app/shared/store/shared.reducers';

const selectSharedState = createSelector(createFeatureSelector<SharedState>(sharedFeatureKey), state => state);