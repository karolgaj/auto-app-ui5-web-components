import { createAction, props } from '@ngrx/store';
import { Tbr } from '../models/tbr.model';
import { TbrLightDetails } from '../models/tbr-light.model';

export const loadTbrs = createAction('[Tbr] Load Tbrs');

export const loadTbrsSuccess = createAction('[Tbr] Load Tbrs Success', props<{ data: TbrLightDetails[] }>());

export const loadTbrsFailure = createAction('[Tbr] Load Tbrs Failure', props<{ error: any }>());

export const createTbr = createAction('[Tbr] Create new Tbr', props<{ data: any }>());

export const createTbrSuccess = createAction('[Tbr] Create new Tbr Success', props<{ data: any }>());

export const createTbrFailure = createAction('[Tbr] Create new Tbr Failure', props<{ error: any }>());

export const selectTbr = createAction('[Tbr] Select Tbr', props<{ data: string }>());
export const selectTbrSuccess = createAction('[Tbr] Select Tbr Success', props<{ data: Tbr }>());
export const selectTbrFailure = createAction('[Tbr] Select Tbr Failure', props<{ error: any }>());
