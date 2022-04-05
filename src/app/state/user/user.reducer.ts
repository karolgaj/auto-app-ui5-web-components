import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { UserData } from '../../models/user.model';

export const userFeatureKey = 'user';

export interface State {
  user: UserData | null;
  error?: any;
}

export const initialState: State = {
  user: null,
};

export const reducer = createReducer(
  initialState,

  on(UserActions.loadUserDataSuccess, (state, action) => ({
    ...state,
    user: action.data,
  })),
  on(UserActions.loadUserDataFailure, (state, action) => ({
    ...state,
    error: action.error,
  }))
);
