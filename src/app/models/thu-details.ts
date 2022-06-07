import { PackInstructionMaterial } from './pack-instruction-material';

export interface ThuDetails {
  altPackInstructionNumber: string;
  baseThuId: string;
  consignee: string;
  consigneeName: string;
  consignorName: string;
  customerNumber2: string;
  description: string;
  dimensionOverRide: boolean;
  dimensionUom: string;
  dynamicCallOff: boolean;
  flexibleUnitLoad: boolean;
  grossWeight: number;
  height: number;
  internalText: string;
  lastCheck: string;
  length: number;
  loadingDirection: string;
  longText: string;
  minimumQuantity: number;
  oldPackInstructionNumber: string;
  packInstructionMaterials?: PackInstructionMaterial[];
  packInstructionNumber: string;
  packRefCode: string;
  parmaList: string[];
  partContainerGrossWeight: number;
  partContainerUnitload: number;
  partNumber: string;
  partQuantity: number;
  partWeight: number;
  recordCreatedBy: string;
  recordCreatedDate: null;
  recordLastChangeBy: string;
  recordLastChangeDate: null;
  shipFrom: string;
  stackable: boolean;
  status: string;
  subHuGrossWeight: number;
  subMaterial: string;
  supplierConfirmedBy: string;
  supplierConfirmedDate: null;
  thuFlag: boolean;
  thuId: string;
  transferKey: string;
  type: string;
  unloadingPoint: string;
  validFromDate: null;
  validToDate: null;
  volume: number;
  volumeUom: string;
  weightUom: string;
  width: number;
}
