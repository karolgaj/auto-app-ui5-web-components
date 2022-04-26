import { createReducer, on } from '@ngrx/store';
import * as TbrActions from './tbr.actions';
import { Tbr } from '../../models/tbr.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { Consignor } from '../../models/consignor.model';
import { UnloadingPoint } from '../../models/unloading-point.model';
import { ShipItem } from '../../models/ship-item.model';
import { ReasonCodesDetails } from '../../models/reason-code.model';

export const tbrFeatureKey = 'tbr';

export interface State {
  tbrs: TbrLightDetails[];
  networks?: TbrNetwork[];
  consignors?: Consignor[];
  unloadingPoints?: UnloadingPoint[];
  shipItems?: ShipItem[];
  selectedTbr?: Tbr;
  reasonCodes?: ReasonCodesDetails[];
  error?: any;
}

export const initialState: State = {
  tbrs: [],
};

export const reducer = createReducer(
  initialState,

  on(TbrActions.loadTbrsSuccess, (state, action) => ({ ...state, tbrs: action.data })),
  on(TbrActions.loadAvailableNetworksSuccess, (state, action) => ({ ...state, networks: action.data })),
  on(TbrActions.loadConsignorsSuccess, (state, action) => ({ ...state, consignors: action.data })),
  on(TbrActions.loadUnloadingPointsSuccess, (state, action) => ({ ...state, unloadingPoints: action.data })),
  on(TbrActions.loadShipItemsSuccess, (state, action) => ({ ...state, shipItems: action.data })),
  on(TbrActions.loadReasonCodesSuccess, (state, action) => ({ ...state, reasonCodes: action.data })),

  on(TbrActions.createTbrSuccess, (state, action) => ({ ...state, tbrs: [...state.tbrs, action.data] })),
  on(TbrActions.selectTbr, (state) => ({
    ...state,
    selectedTbr: undefined,
  })),
  on(TbrActions.selectTbrSuccess, (state, action) => ({
    ...state,
    selectedTbr: action.data,
  })),
  on(TbrActions.updateSelectedTbr, (state, action) => {
    let selectedTbr = { ...state.selectedTbr } as Tbr;
    const data = { ...action.data };

    if (data.approvalDecision) {
      selectedTbr.approvalDecision = {
        ...selectedTbr.approvalDecision,
        ...data.approvalDecision,
      };

      delete data.approvalDecision;
    }

    selectedTbr = {
      ...selectedTbr,
      ...data,
    };

    return {
      ...state,
      selectedTbr,
    };
  }),

  on(
    TbrActions.loadTbrsFailure,
    TbrActions.selectTbrFailure,
    TbrActions.loadAvailableNetworksFailure,
    TbrActions.loadUnloadingPointsFailure,
    TbrActions.loadShipItemsFailure,
    TbrActions.createTbrFailure,
    TbrActions.loadReasonCodesFailure,
    (state, action) => ({
      ...state,
      error: action.error,
    })
  )
);
