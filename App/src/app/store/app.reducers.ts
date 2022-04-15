import { createReducer, on } from '@ngrx/store';
import { ImportancyFilter } from 'src/app/models/importancy-filter';
import * as fromActions from 'src/app/store/app.actions';
import { AppState } from 'src/app/store/app.state';

const initialState: AppState =
{
    words: [],
    filter: {
        search: '',
        importancy: ImportancyFilter.All
    },
    isLoading: false,
    error: null
};

export const appReducer = createReducer(
    initialState,
    on(fromActions.getWords, (state, _) => ({
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
    on(fromActions.getOneWordById, (state, _) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(fromActions.getOneWordByIdSuccess, (state, _) => ({
        ...state,
        isLoading: false
    })),
    on(fromActions.getOneWordByIdFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(fromActions.createWord, (state, _) => ({
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
    on(fromActions.updateWord, (state, _) => ({
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
    on(fromActions.deleteWord, (state, _) => ({
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
    on(fromActions.setFilter, (state, action) => ({
        ...state,
        filter: {
            ...state.filter,
            search: action.search,
            importancy: action.importancy
        },
        words: [...state.words]
    })),
    on(fromActions.clearFilter, (state, _) => ({
        ...state,
        filter: { ...initialState.filter },
        words: [...state.words]
    })),
    on(fromActions.clear, (state, __) => ({
        ...state
    }))
);