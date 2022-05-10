import { createAction, props } from '@ngrx/store';
import { Tbr } from '../../models/tbr.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm } from '../../models/network-form.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { Consignor } from '../../models/consignor.model';
import { UnloadingPoint } from '../../models/unloading-point.model';
import { ShipItem } from '../../models/ship-item.model';
import { ShipPoint } from '../../models/ship-point.model';
import { TransportHandlingUnit } from '../../models/transport-handling-unit.model';
import { ShipitStatus } from '../../models/tbr-type.model';

export const loadTbrs = createAction('[Tbr] Load Tbrs', props<{ data: { query: string } }>());
export const loadTbrsSuccess = createAction('[Tbr] Load Tbrs Success', props<{ data: TbrLightDetails[] }>());
export const loadTbrsFailure = createAction('[Tbr] Load Tbrs Failure', props<{ error: any }>());

export const refreshTbrList = createAction('[Tbr] Refresh Tbr List', props<{ data: { query: string } }>());
export const refreshTbrListSuccess = createAction('[Tbr] Refresh Tbr List Success');

export const createTbr = createAction('[Tbr] Create new Tbr', props<{ data: Partial<TbrLightDetails> }>());
export const createTbrSuccess = createAction('[Tbr] Create new Tbr Success', props<{ data: any }>());
export const createTbrFailure = createAction('[Tbr] Create new Tbr Failure', props<{ error: unknown }>());

export const selectTbr = createAction('[Tbr] Select Tbr', props<{ data: string | null }>());
export const selectTbrSuccess = createAction('[Tbr] Select Tbr Success', props<{ data: Tbr }>());
export const selectTbrFailure = createAction('[Tbr] Select Tbr Failure', props<{ error: unknown }>());

export const updateSelectedTbr = createAction('[Tbr] Update Selected Tbr', props<{ data: Partial<Tbr> }>());

export const updateTbr = createAction('[Tbr] Update Tbr');
export const updateTbrSuccess = createAction('[Tbr] Update Tbr Success', props<{ data: Tbr }>());
export const updateTbrFailure = createAction('[Tbr] Update Tbr Failure', props<{ error: unknown }>());

export const loadAvailableNetworks = createAction('[Networks] Load network', props<{ data: NetworkForm }>());
export const loadAvailableNetworksSuccess = createAction('[Networks] Load network Success', props<{ data: TbrNetwork[] }>());
export const loadAvailableNetworksFailure = createAction('[Networks] Load network Failure', props<{ error: unknown }>());

export const loadConsignors = createAction('[Networks] Load consignors', props<{ data?: any }>());
export const loadConsignorsSuccess = createAction('[Networks] Load consignors Success', props<{ data: Consignor[] }>());
export const loadConsignorsFailure = createAction('[Networks] Load consignors Failure', props<{ error: unknown }>());

export const loadUnloadingPoints = createAction(
  '[Networks] Load unloading points',
  props<{ data: { consignor: string; shipFrom: string } }>()
);
export const loadUnloadingPointsSuccess = createAction('[Networks] Load unloading points Success', props<{ data: UnloadingPoint[] }>());
export const loadUnloadingPointsFailure = createAction('[Networks] Load unloading points Failure', props<{ error: unknown }>());

export const loadShipPoints = createAction('[Networks] Load ship points', props<{ data: string }>());
export const loadShipPointsSuccess = createAction('[Networks] Load ship points Success', props<{ data: ShipPoint[] }>());
export const loadShipPointsFailure = createAction('[Networks] Load ship points Failure', props<{ error: unknown }>());

export const addLine = createAction(
  '[XTR] Add line',
  props<{
    data: {
      shipItId: string;
      partNo: string;
      plannedQty: number;
      poNumber: string;
    };
  }>()
);
export const addLineSuccess = createAction('[XTR] Add line Success', props<{ data: Tbr }>());
export const addLineFailure = createAction('[XTR] Add line Failure', props<{ error: unknown }>());

export const splitLine = createAction(
  '[XTR] Split line',
  props<{
    data: {
      shipItId: string;
      releaseLines: string;
    };
  }>()
);
export const splitLineSuccess = createAction('[XTR] Split line Success', props<{ data: Tbr }>());
export const splitLineFailure = createAction('[XTR] Split line Failure', props<{ error: unknown }>());

export const loadShipItems = createAction('[Networks] Load ship items');
export const loadShipItemsSuccess = createAction('[Networks] Load ship items Success', props<{ data: ShipItem[] }>());
export const loadShipItemsFailure = createAction('[Networks] Load ship items Failure', props<{ error: unknown }>());

export const updateReference = createAction('[Express] Update Reference', props<{ data: any }>());
export const updateReferenceSuccess = createAction('[Express] Update Reference Success', props<{ data: any }>());
export const updateReferenceFailure = createAction('[Express] Update Reference Failure', props<{ error: unknown }>());

export const loadThuList = createAction('[Networks] Load thu list', props<{ data: string }>());
export const loadThuListSuccess = createAction('[Networks] Load thu list Success', props<{ data: TransportHandlingUnit[] }>());
export const loadThuListFailure = createAction('[Networks] Load thu list Failure', props<{ error: unknown }>());

export const goToWorkflow = createAction('[XTR] Go to workflow', props<{ data: ShipitStatus }>());
export const goToWorkflowSuccess = createAction('[XTR] Go to workflow Success', props<{ data: Tbr }>());
