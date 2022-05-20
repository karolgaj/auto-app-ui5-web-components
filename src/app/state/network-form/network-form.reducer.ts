import { createReducer, on } from '@ngrx/store';
import * as NetworkFormActions from './network-form.actions';
import { PartyLocation } from '../../models/location.model';
import { Tbr } from '../../models/tbr.model';

export const networkFormFeatureKey = 'networkForm';

export interface State {
  booking?: Partial<Tbr>;
  shipFroms?: PartyLocation[];
  shipTos?: PartyLocation[];
  consignors?: PartyLocation[];
  unloadPoint?: string[];
}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(NetworkFormActions.createEmptyBookingSuccess, (state, action) => ({
    ...state,
    booking: action.data,
  })),
  on(NetworkFormActions.loadShipFromSuccess, (state, action) => ({
    ...state,
    shipFroms: action.data,
  })),
  on(NetworkFormActions.loadShipToSuccess, (state, action) => ({
    ...state,
    shipTos: action.data,
  })),
  on(NetworkFormActions.loadConsignorsSuccess, (state, action) => ({
    ...state,
    consignors: action.data,
  })),
  on(NetworkFormActions.loadUnloadingPointSuccess, (state, action) => ({
    ...state,
    unloadPoint: action.data,
  }))
);
