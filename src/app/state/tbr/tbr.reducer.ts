import { createReducer, on } from '@ngrx/store';
import { ThuDetails } from 'src/app/models/thu-details';
import * as TbrActions from './tbr.actions';
import { Tbr } from '../../models/tbr.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { Consignor } from '../../models/consignor.model';
import { UnloadingPoint } from '../../models/unloading-point.model';
import { ShipItem } from '../../models/ship-item.model';
import { TransportHandlingUnit } from '../../models/transport-handling-unit.model';

export const tbrFeatureKey = 'tbr';

export interface State {
  tbrs: TbrLightDetails[];
  networks?: TbrNetwork[];
  consignors?: Consignor[];
  unloadingPoints?: UnloadingPoint[];
  thuData?: ThuDetails;
  shipItems?: ShipItem[];
  selectedTbr?: Tbr;
  thuList?: TransportHandlingUnit[];
  error?: any;
}

export const initialState: State = {
  tbrs: [],
};

export const reducer = createReducer(
  initialState,

  on(TbrActions.loadTbrsSuccess, (state, action) => ({ ...state, tbrs: action.data })),
  on(TbrActions.refreshTbrListSuccess, (state, action) => ({ ...state, tbrs: action.data })),
  on(TbrActions.loadAvailableNetworksSuccess, (state, action) => ({ ...state, networks: action.data })),
  on(TbrActions.loadConsignorsSuccess, (state, action) => ({ ...state, consignors: action.data })),
  on(TbrActions.loadUnloadingPointsSuccess, (state, action) => ({ ...state, unloadingPoints: action.data })),
  on(TbrActions.loadShipItemsSuccess, (state, action) => ({ ...state, shipItems: action.data })),

  on(TbrActions.createTbrSuccess, (state, action) => ({ ...state, tbrs: [...state.tbrs, action.data] })),
  on(TbrActions.selectTbr, (state) => ({
    ...state,
    selectedTbr: undefined,
  })),
  on(
    TbrActions.selectTbrSuccess,
    TbrActions.addLineSuccess,
    TbrActions.addLineWithoutPartNumberSuccess,
    TbrActions.addHazmatDetailsSuccess,
    TbrActions.deleteHazmatDetailsSuccess,
    TbrActions.setManualThuSuccess,
    TbrActions.splitLineSuccess,
    (state, action) => ({
      ...state,
      selectedTbr: action.data,
    })
  ),
  on(TbrActions.loadThuListSuccess, (state, action) => ({
    ...state,
    thuList: action.data,
  })),
  on(TbrActions.loadThuDataSuccess, (state, action) => ({
    ...state,
    thuData: action.data,
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
    (state, action) => ({
      ...state,
      error: action.error,
    })
  )
);
