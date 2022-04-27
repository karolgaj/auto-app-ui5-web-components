import { createReducer, on } from '@ngrx/store';
import * as DictionariesActions from './dictionaries.actions';
import { ReasonCodesDetails } from '../../models/reason-code.model';
import { HazmatClass } from '../../models/hazmat-class.model';
import { CountryCode } from '../../models/country-code.model';

export const dictionariesFeatureKey = 'dictionaries';

export interface State {
  reasonCodes?: ReasonCodesDetails[];
  hazmatClasses?: HazmatClass[];
  countryList?: CountryCode[];
  error?: any;
}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(DictionariesActions.loadReasonCodesSuccess, (state, action) => ({ ...state, reasonCodes: action.data })),
  on(DictionariesActions.loadCountryListSuccess, (state, action) => ({ ...state, countryList: action.data })),
  on(DictionariesActions.loadHazmatClassesSuccess, (state, action) => ({ ...state, hazmatClasses: action.data })),

  on(DictionariesActions.loadReasonCodesFailure, (state, action) => ({
    ...state,
    error: action.error,
  }))
);
