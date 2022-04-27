import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDictionaries from './dictionaries.reducer';
import { ReasonCode } from '../../models/reason-code.model';

export const selectDictionariesState = createFeatureSelector<fromDictionaries.State>(fromDictionaries.dictionariesFeatureKey);

export const selectCauses = (type?: 'SUPPLIER' | 'VOLVO') =>
  createSelector(selectDictionariesState, (state) => {
    if (!state.reasonCodes) {
      return [];
    }

    if (type) {
      return state.reasonCodes?.find((reasonCode) => reasonCode.payer === type)?.reasonCodes ?? [];
    }

    return state.reasonCodes?.reduce((acc: ReasonCode[], curr) => acc.concat(curr.reasonCodes), []);
  });
