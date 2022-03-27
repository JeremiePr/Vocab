import { createFeatureSelector, createSelector } from '@ngrx/store';
import { manageFeatureKey, ManageState } from 'src/app/pages/manage/store/manage.reducers';

const selectManageState = createSelector(createFeatureSelector<ManageState>(manageFeatureKey), state => state);
