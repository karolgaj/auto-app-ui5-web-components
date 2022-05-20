import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNetworkForm from './network-form.reducer';

export const selectNetworkFormState = createFeatureSelector<fromNetworkForm.State>(fromNetworkForm.networkFormFeatureKey);
export const selectShipFrom = createSelector(selectNetworkFormState, (state) => state.shipFroms);
export const selectShipTo = createSelector(selectNetworkFormState, (state) => state.shipTos);
export const selectConsignors = createSelector(selectNetworkFormState, (state) => state.consignors);
export const selectNewBooking = createSelector(selectNetworkFormState, (state) => state.booking);
export const selectUnloadPoint = createSelector(selectNetworkFormState, (state) => state.unloadPoint);
