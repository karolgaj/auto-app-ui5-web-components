import { createReducer, on } from '@ngrx/store';
import * as TbrActions from './tbr.actions';
import { Tbr } from '../models/tbr.model';
import { TbrLightDetails } from '../models/tbr-light.model';

export const tbrFeatureKey = 'tbr';

export interface State {
  tbrs: TbrLightDetails[];
  selectedTbr?: Tbr;
  error?: any;
}

export const initialState: State = {
  tbrs: [],
};

export const reducer = createReducer(
  initialState,

  on(TbrActions.loadTbrsSuccess, (state, action) => ({ ...state, tbrs: action.data })),
  on(TbrActions.loadTbrsFailure, (state, action) => ({ ...state, error: action.error })),
  on(TbrActions.selectTbrSuccess, (state, action) => ({
    ...state,
    selectedTbr: action.data,
  })),
  on(TbrActions.selectTbrFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
  on(TbrActions.createTbrSuccess, (state, action) => ({ ...state, tbrs: [...state.tbrs, action.data] })),
  on(TbrActions.createTbrFailure, (state, action) => ({ ...state, error: action.error }))
);
