import { createReducer } from '@ngrx/store';

export const manageFeatureKey = 'manage';

export interface ManageState
{

}

export const initialState: ManageState = {

};

export const manageReducer = createReducer(
    initialState
);