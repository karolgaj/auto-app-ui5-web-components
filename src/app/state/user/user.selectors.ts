import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.userFeatureKey);

export const selectUserData = createSelector(selectUserState, (state) => state.user);
export const selectUserTimeFormat = createSelector(selectUserData, (userData) => userData?.timeFormat);
export const selectUserDateFormat = createSelector(selectUserData, (userData) => userData?.dateFormat);
