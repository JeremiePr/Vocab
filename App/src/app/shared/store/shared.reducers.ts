import { createReducer } from '@ngrx/store';

export const sharedFeatureKey = 'shared';

export interface SharedState
{

}

export const initialState: SharedState = {

};

export const sharedReducer = createReducer(
    initialState
);