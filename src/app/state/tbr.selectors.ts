import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTbr from './tbr.reducer';

export const selectTbrState = createFeatureSelector<fromTbr.State>(fromTbr.tbrFeatureKey);

export const selectTbrs = createSelector(selectTbrState, (state) => state.tbrs);
export const selectNetworks = createSelector(selectTbrState, (state) => state.networks);
export const selectConsignors = createSelector(selectTbrState, (state) => state.consignors);
export const selectUnloadingPoints = createSelector(selectTbrState, (state) => state.unloadingPoints);
export const selectShipItems = createSelector(selectTbrState, (state) => state.shipItems);
export const selectedTbr = createSelector(selectTbrState, (state) => state.selectedTbr);
export const selectError = createSelector(selectTbrState, (state) => state.error);
