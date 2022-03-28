import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTbr from './tbr.reducer';
import { ReasonCode } from '../models/reason-code.model';

export const selectTbrState = createFeatureSelector<fromTbr.State>(fromTbr.tbrFeatureKey);

export const selectTbrs = createSelector(selectTbrState, (state) => state.tbrs);
export const selectNetworks = createSelector(selectTbrState, (state) => state.networks);
export const selectConsignors = createSelector(selectTbrState, (state) => state.consignors);
export const selectUnloadingPoints = createSelector(selectTbrState, (state) => state.unloadingPoints);
export const selectShipItems = createSelector(selectTbrState, (state) => state.shipItems);
export const selectedTbr = createSelector(selectTbrState, (state) => state.selectedTbr);

export const selectCauses = (type?: 'SUPPLIER' | 'VOLVO') =>
  createSelector(selectTbrState, (state) => {
    if (!state.reasonCodes) {
      return [];
    }

    if (type) {
      return state.reasonCodes?.find((reasonCode) => reasonCode.payer === type)?.reasonCodes ?? [];
    }

    return state.reasonCodes?.reduce((acc: ReasonCode[], curr) => acc.concat(curr.reasonCodes), []);
  });

export const selectError = createSelector(selectTbrState, (state) => state.error);
