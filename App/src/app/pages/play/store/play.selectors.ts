import { createFeatureSelector, createSelector } from '@ngrx/store';
import { playFeatureKey, PlayState } from 'src/app/pages/play/store/play.reducers';

const selectPlayState = createSelector(createFeatureSelector<PlayState>(playFeatureKey), state => state);
