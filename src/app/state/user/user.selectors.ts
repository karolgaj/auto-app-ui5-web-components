import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';
import { PartyLocation } from '../../models/location.model';

export const selectUserState = createFeatureSelector<fromUser.State>(fromUser.userFeatureKey);

export const selectUserData = createSelector(selectUserState, (state) => state.user);
export const selectIsAuthenticated = createSelector(selectUserState, (state) => state.isAuthenticated);
export const selectUserTimeFormat = createSelector(selectUserData, (userData) => userData?.timeFormat);
export const selectUserDateFormat = createSelector(selectUserData, (userData) => userData?.dateFormat);
export const selectUserRoles = createSelector(selectUserData, (userData) =>
  userData?.roles.filter((r) => r !== 'EXPRESS_REQUESTER_LIMITED')
);
export const selectUserConsignorParmas = createSelector(selectUserData, (userData) =>
  userData?.consignorParmas.map(
    (v) =>
      ({
        parmaId: v,
        parmaName: v,
        parmaCountryCode: '',
      } as PartyLocation)
  )
);
export const selectUserConsigneeParmas = createSelector(selectUserData, (userData) =>
  userData?.consigneeParmas.map(
    (v) =>
      ({
        parmaId: v,
        parmaName: v,
        parmaCountryCode: '',
      } as PartyLocation)
  )
);
