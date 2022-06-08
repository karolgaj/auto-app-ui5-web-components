import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTbr from './tbr.reducer';
import { mapToLines } from '../../utils/map-lines';
import { ShipItStatusType } from '../../models/tbr-type.model';
import { Tbr } from '../../models/tbr.model';

export const selectTbrState = createFeatureSelector<fromTbr.State>(fromTbr.tbrFeatureKey);

export const selectTbrs = createSelector(selectTbrState, (state) => state.tbrs);
export const selectTbrsByType = (type: ShipItStatusType | ShipItStatusType[]) =>
  createSelector(selectTbrState, (state) =>
    state.tbrs.filter((tbr) => {
      if (Array.isArray(type)) {
        return type.includes(tbr.shipitStatusType);
      }
      return tbr.shipitStatusType === type;
    })
  );
export const selectNetworks = createSelector(selectTbrState, (state) => state.networks);
export const selectConsignors = createSelector(selectTbrState, (state) => state.consignors);
export const selectUnloadingPoints = createSelector(selectTbrState, (state) => state.unloadingPoints);
export const selectShipItems = createSelector(selectTbrState, (state) => state.shipItems);

export const selectSubThuList = createSelector(selectTbrState, (state) => state.subThuList);
export const selectPlantSpecificList = createSelector(selectTbrState, (state) => state.plantSpecificList);
export const selectThu = createSelector(selectTbrState, (state) => state.thuData);

export const selectedTbr = createSelector(selectTbrState, (state) =>
  state.selectedTbr
    ? ({
        ...state.selectedTbr,
        lines: mapToLines(state.selectedTbr),
      } as Tbr)
    : undefined
);

export const selectError = createSelector(selectTbrState, (state) => state.error);

export const selectThuList = createSelector(selectTbrState, (state) => [
  {
    thuId: 'OTHER',
    description: 'Other',
    id: 'OTHER',
  },
  ...(state.thuList || []),
]);
