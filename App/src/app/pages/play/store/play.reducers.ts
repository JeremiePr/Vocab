import { createReducer } from '@ngrx/store';

export const playFeatureKey = 'play';

export interface PlayState
{

}

export const initialState: PlayState = {

};

export const playReducer = createReducer(
    initialState
);