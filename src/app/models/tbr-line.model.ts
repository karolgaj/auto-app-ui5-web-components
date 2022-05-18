import { ShipUnitLine } from './tbr.model';

export interface TbrLine extends ShipUnitLine {
  releaseLineId: string;
  additionalInternalDestination: null;
  articleNumber: string;
  articleName: string;
  requestedQuantity: string;
  packagedQuantity: string;
  purchaseOrderNumber: string;
  width: string;
  length: string;
  height: string;
  weight: string;
  weightUOM: string;
  notDelivered: boolean;
  deleted: boolean;
  userThu: boolean;
  quantity: string;
  weightSUL: number;
  volumeSUL: number;
  valueStateTHU: string;
  valueStateQty: string;
  whLoc: null;
  baseType: string;
  type: string;
  stackable: boolean;
  temperatureControl: boolean;
  dangerousGoods: boolean;
  customsGoods: boolean;
  loadingMeters: boolean;
  weightSULuom: string;
  volumeSULuom: string;
  subHu: string;
  tbrType: string;
  mixValid: boolean;
  volumeSULUom: string;
  weightSULUom: string;
}
