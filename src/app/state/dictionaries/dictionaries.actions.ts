import { createAction, props } from '@ngrx/store';
import { ReasonCodesDetails } from '../../models/reason-code.model';
import { HazmatClass } from '../../models/hazmat-class.model';
import { CountryCode } from '../../models/country-code.model';

export const loadCountryList = createAction('[Dictionaries] Load country list');
export const loadCountryListSuccess = createAction('[Dictionaries] Load country list Success', props<{ data: CountryCode[] }>());
export const loadCountryListFailure = createAction('[Dictionaries] Load country list Failure', props<{ error: unknown }>());

export const loadHazmatClasses = createAction('[Dictionaries] Load hazmat classes');
export const loadHazmatClassesSuccess = createAction('[Dictionaries] Load hazmat classes Success', props<{ data: HazmatClass[] }>());
export const loadHazmatClassesFailure = createAction('[Dictionaries] Load hazmat classes Failure', props<{ error: unknown }>());

export const loadReasonCodes = createAction('[Dictionaries] Load reason codes');
export const loadReasonCodesSuccess = createAction('[Dictionaries] Load reason codes Success', props<{ data: ReasonCodesDetails[] }>());
export const loadReasonCodesFailure = createAction('[Dictionaries] Load reason codes Failure', props<{ error: unknown }>());
