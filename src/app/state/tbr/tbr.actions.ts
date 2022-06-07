import { createAction, props } from '@ngrx/store';
import { ThuDetails } from 'src/app/models/thu-details';
import { SubTransportHandlingUnit } from 'src/app/models/sub-transport-handling-unit.model';
import { PlantSpecific } from 'src/app/models/plant-specific-model';
import { HazmatDetails, Tbr } from '../../models/tbr.model';
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
export const refreshTbrListSuccess = createAction('[Tbr] Refresh Tbr List Success', props<{ data: TbrLightDetails[] }>());

export const createTbr = createAction('[Tbr] Create new Tbr', props<{ data: Partial<TbrLightDetails> }>());
export const createTbrSuccess = createAction('[Tbr] Create new Tbr Success', props<{ data: any }>());
export const createTbrFailure = createAction('[Tbr] Create new Tbr Failure', props<{ error: unknown }>());

export const selectTbr = createAction('[Tbr] Select Tbr', props<{ data: string | null; redirect?: boolean }>());
export const selectTbrSuccess = createAction('[Tbr] Select Tbr Success', props<{ data: Tbr; redirect?: boolean }>());
export const selectTbrFailure = createAction('[Tbr] Select Tbr Failure', props<{ error: unknown }>());

export const updateSelectedTbr = createAction('[Tbr] Update Selected Tbr', props<{ data: Partial<Tbr> }>());

export const updateTbr = createAction('[Tbr] Update Tbr', props<{ data: Partial<Tbr> }>());
export const updateTbrSuccess = createAction('[Tbr] Update Selected Tbr Success', props<{ data: Partial<Tbr> }>());
export const updateTbrFailure = createAction('[Tbr] Update Selected Tbr Failure', props<{ error: unknown }>());

export const finishWorkflow = createAction('[Tbr] Finish workflow', props<{ data: Partial<Tbr> }>());
export const finishWorkflowSuccess = createAction('[Tbr] Finish workflow Success', props<{ data: Tbr }>());
export const finishWorkflowFailure = createAction('[Tbr] Finish workflow Failure', props<{ error: unknown }>());

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

export const goToWorkflow = createAction('[XTR] Go to workflow', props<{ data: { status: ShipitStatus; deliveryDate: string } }>());
export const goToWorkflowSuccess = createAction('[XTR] Go to workflow Success', props<{ data: string }>());

export const goToWorkflowSummary = createAction('[XTR] Go to workflow summary', props<{ data: string }>());

export const addHazmatDetails = createAction(
  '[Express] Add hazmat details',
  props<{ shipitId: string; releaseLineId: string; hazmatDetails: HazmatDetails }>()
);
export const addHazmatDetailsSuccess = createAction('[Express] Addd hazmat details Success', props<{ data: Tbr }>());
export const addHazmatDetailsFailure = createAction('[Express] Add hazmat details Failure', props<{ error: unknown }>());

export const deleteHazmatDetails = createAction('[Express] Delete hazmat details', props<{ shipitId: string; releaseLineId: string }>());
export const deleteHazmatDetailsSuccess = createAction('[Express] Delete hazmat details Success', props<{ data: Tbr }>());
export const deleteHazmatDetailsFailure = createAction('[Express] Delete hazmat details Failure', props<{ error: unknown }>());

export const addLineWithoutPartNumber = createAction(
  '[XTR] Add line without part number',
  props<{
    data: {
      shipItId: string;
      description: string;
      plannedQty: number;
      weight: string;
    };
  }>()
);
export const addLineWithoutPartNumberSuccess = createAction('[XTR] Add line without part number Success', props<{ data: Tbr }>());
export const addLineWithoutPartNumberFailure = createAction('[XTR] Add line without part number Failure', props<{ error: unknown }>());

export const loadThuData = createAction('[Tbr] Load THU data', props<{ data: { shipFromId: string; thuId: string } }>());
export const loadThuDataSuccess = createAction('[Tbr] Load THU data Success', props<{ data: ThuDetails }>());
export const loadThuDataFailure = createAction('[Tbr] Load THU data Failure', props<{ error: unknown }>());

export const setManualThu = createAction('[Tbr] Set manual thu', props<{ shipItId: string; releaseLineId: string; pi: ThuDetails }>());
export const setManualThuSuccess = createAction('[Tbr] Set manual thu Success', props<{ data: Tbr }>());
export const setManualThuFailure = createAction('[Tbr] Set manual thu Failure', props<{ error: unknown }>());

export const deleteLine = createAction(
  '[XTR] Delete line',
  props<{
    data: {
      shipItId: string;
      releaseLineId: string;
    };
  }>()
);
export const deleteLineSuccess = createAction('[XTR] Delete line Success', props<{ data: Tbr }>());
export const deleteLineFailure = createAction('[XTR] delete line Failure', props<{ error: unknown }>());

export const loadSubThuList = createAction('[Networks] Load sub thu list', props<{ data: string }>());
export const loadSubThuListSuccess = createAction('[Networks] Load sub thu list Success', props<{ data: SubTransportHandlingUnit[] }>());
export const loadSubThuListFailure = createAction('[Networks] Load sub thu list Failure', props<{ error: unknown }>());

export const loadPlantSpecificList = createAction('[Networks] Load plant specific list');
export const loadPlantSpecificListSuccess = createAction('[Networks] Load plant specific list Success', props<{ data: PlantSpecific[] }>());
export const loadPlantSpecificListFailure = createAction('[Networks] Load plant specific list Failure', props<{ error: unknown }>());
