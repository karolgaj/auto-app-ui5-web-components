import { createAction, props } from '@ngrx/store';
import { PartyLocation } from '../../models/location.model';
import { Tbr } from '../../models/tbr.model';
import { Network } from '../../models/network.model';

export const createEmptyBooking = createAction('[NetworkForm] Create Empty Booking');
export const createEmptyBookingSuccess = createAction(
  '[NetworkForm] Create Empty Booking Success',
  props<{ data: Partial<Tbr> & Required<{ shipitId: string }> }>()
);
export const createEmptyBookingFailure = createAction('[NetworkForm] Create Empty Booking Failure', props<{ error: unknown }>());

export const loadShipFrom = createAction('[NetworkForm] Load Ship From');
export const loadShipFromSuccess = createAction('[NetworkForm] Load Ship From Success', props<{ data: PartyLocation[] }>());
export const loadShipFromFailure = createAction('[NetworkForm] Load Ship From Failure', props<{ error: unknown }>());

export const loadShipTo = createAction('[NetworkForm] Load Ship To');
export const loadShipToSuccess = createAction('[NetworkForm] Load Ship To Success', props<{ data: PartyLocation[] }>());
export const loadShipToFailure = createAction('[NetworkForm] Load Ship To Failure', props<{ error: unknown }>());

export const loadConsignors = createAction('[NetworkForm] Load Consignors');
export const loadConsignorsSuccess = createAction('[NetworkForm] Load Consignors Success', props<{ data: PartyLocation[] }>());
export const loadConsignorsFailure = createAction('[NetworkForm] Load Consignors Failure', props<{ error: unknown }>());

export const loadConsignees = createAction('[NetworkForm] Load Consignees', props<{ data: string }>());
export const loadConsigneesSuccess = createAction('[NetworkForm] Load Consignees Success', props<{ data: PartyLocation[] }>());
export const loadConsigneesFailure = createAction('[NetworkForm] Load Consignees Failure', props<{ error: unknown }>());

export const loadUnloadingPoint = createAction('[NetworkForm] Load Unloading Point', props<{ data: string }>());
export const loadUnloadingPointSuccess = createAction('[NetworkForm] Load Unloading Point Success', props<{ data: string[] }>());
export const loadUnloadingPointFailure = createAction('[NetworkForm] Load Unloading Point Failure', props<{ error: unknown }>());

export const updateNetwork = createAction('[NetworkForm] Update network', props<{ data: Partial<Network>; shipitId: string }>());
export const updateNetworkSuccess = createAction('[NetworkForm] Update network success');
export const updateNetworkFailure = createAction('[NetworkForm] Update network failure', props<{ error: unknown }>());
