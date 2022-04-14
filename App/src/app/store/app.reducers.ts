import { createReducer, on } from '@ngrx/store';
import * as fromActions from 'src/app/store/app.actions';
import { AppState } from 'src/app/store/app.state';

export const initialState: AppState =
{
    words: [],
    search: '',
    isLoading: false,
    error: null
};

export const appReducer = createReducer(
    initialState,
    on(fromActions.getWords, (state, __) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.getWordsSuccess, (state, action) => ({
        ...state,
        words: action.words,
        isLoading: false
    })),
    on(fromActions.getWordsFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.getOneWordById, (state, __) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.getOneWordByIdSuccess, (state, __) => ({
        ...state,
        isLoading: false
    })),
    on(fromActions.getOneWordByIdFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.createWord, (state, __) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.createWordSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        words: action.words
    })),
    on(fromActions.createWordFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.updateWord, (state, __) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.updateWordSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        words: action.words
    })),
    on(fromActions.updateWordFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.deleteWord, (state, __) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.deleteWordSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        words: action.words
    })),
    on(fromActions.deleteWordFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.setSearch, (state, action) => ({
        ...state,
        search: action.search,
        words: [...state.words]
    })),
    on(fromActions.clear, (state, __) => ({
        ...state
    }))
);