import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTbr from './tbr.reducer';

export const selectTbrState = createFeatureSelector<fromTbr.State>(fromTbr.tbrFeatureKey);

export const selectTbrs = createSelector(selectTbrState, (state) => state.tbrs);
export const selectedTbr = createSelector(selectTbrState, (state) => state.selectedTbr);
export const selectError = createSelector(selectTbrState, (state) => state.error);
