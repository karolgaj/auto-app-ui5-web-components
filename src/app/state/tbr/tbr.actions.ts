import { createAction, props } from '@ngrx/store';
import { Tbr } from '../../models/tbr.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm } from '../../models/network-form.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { Consignor } from '../../models/consignor.model';
import { UnloadingPoint } from '../../models/unloading-point.model';
import { ShipItem } from '../../models/ship-item.model';
import { ReasonCodesDetails } from '../../models/reason-code.model';

export const loadTbrs = createAction('[Tbr] Load Tbrs', props<{ data: { query: string } }>());
export const loadTbrsSuccess = createAction('[Tbr] Load Tbrs Success', props<{ data: TbrLightDetails[] }>());
export const loadTbrsFailure = createAction('[Tbr] Load Tbrs Failure', props<{ error: any }>());

export const refreshTbrList = createAction('[Tbr] Refresh Tbr List', props<{ data: { query: string } }>());

export const createTbr = createAction('[Tbr] Create new Tbr', props<{ data: Partial<TbrLightDetails> }>());
export const createTbrSuccess = createAction('[Tbr] Create new Tbr Success', props<{ data: any }>());
export const createTbrFailure = createAction('[Tbr] Create new Tbr Failure', props<{ error: unknown }>());

export const selectTbr = createAction('[Tbr] Select Tbr', props<{ data: string }>());
export const selectTbrSuccess = createAction('[Tbr] Select Tbr Success', props<{ data: Tbr }>());
export const selectTbrFailure = createAction('[Tbr] Select Tbr Failure', props<{ error: unknown }>());

export const updateSelectedTbr = createAction('[Tbr] Update Selected Tbr', props<{ data: Partial<Tbr> }>());

export const loadAvailableNetworks = createAction('[Networks] Load network', props<{ data: NetworkForm }>());
export const loadAvailableNetworksSuccess = createAction('[Networks] Load network Success', props<{ data: TbrNetwork[] }>());
export const loadAvailableNetworksFailure = createAction('[Networks] Load network Failure', props<{ error: unknown }>());

export const loadConsignors = createAction('[Networks] Load consignors', props<{ data?: any }>());
export const loadConsignorsSuccess = createAction('[Networks] Load consignors Success', props<{ data: Consignor[] }>());
export const loadConsignorsFailure = createAction('[Networks] Load consignors Failure', props<{ error: unknown }>());

export const loadUnloadingPoints = createAction('[Networks] Load unloading points', props<{ data: NetworkForm }>());
export const loadUnloadingPointsSuccess = createAction('[Networks] Load unloading points Success', props<{ data: UnloadingPoint[] }>());
export const loadUnloadingPointsFailure = createAction('[Networks] Load unloading points Failure', props<{ error: unknown }>());

export const loadShipItems = createAction('[Networks] Load ship items');
export const loadShipItemsSuccess = createAction('[Networks] Load ship items Success', props<{ data: ShipItem[] }>());
export const loadShipItemsFailure = createAction('[Networks] Load ship items Failure', props<{ error: unknown }>());

export const loadReasonCodes = createAction('[Networks] Load reason codes');
export const loadReasonCodesSuccess = createAction('[Networks] Load reason codes Success', props<{ data: ReasonCodesDetails[] }>());
export const loadReasonCodesFailure = createAction('[Networks] Load reason codes Failure', props<{ error: unknown }>());

export const updateReference = createAction('[Express] Update Reference', props<{ data: any }>());
export const updateReferenceSuccess = createAction('[Express] Update Reference Success', props<{ data: any }>());
export const updateReferenceFailure = createAction('[Express] Update Reference Failure', props<{ error: unknown }>());
