import { ShipitStatus } from './tbr-type.model';
import { TbrLine } from './tbr-line.model';

export interface Tbr {
  additionalContacts?: AdditionalContact[];
  orderReleaseLines: OrderReleaseLine[];
  transportBookings: any[];
  shipUnitLines: ShipUnitLine[];
  involvedParties: any[];
  otmTransmissionAcks: any[];
  advancedShippingNotices: any[];
  consignee: Consignee;
  consignor: Consignee;
  shipTo: Consignee;
  shipFrom: Consignee;
  approvalRequest: any;
  approvalDecision: ApprovalDecision;
  responsibleOfficeDecision: null;
  transportNetwork: TransportNetwork;
  apiVersion: string;
  tbrId: null;
  tbrType: string;
  shipitId: string;
  shipitStatus: ShipitStatus;
  shipitStatusType: string;
  originalShipitId: null;
  baseShipUnitLineId: string;
  baseOrderReleaseLineId: string;
  deliveryDate: string;
  originalDeliveryDate: string;
  deadlineDate: null;
  deadlineTime: null;
  expressType: string;
  unloadingPoint: null;
  unloadingPointName: null;
  orderWeight: string;
  orderWeightUom: WeightUom;
  orderVolume: string;
  orderVolumeUom: string;
  orderType: string;
  pmrEnabled: boolean;
  replaced: boolean;
  deleted: boolean;
  split: boolean;
  orderNumbers: any[];
  dispatchAdviceNumber?: string;
  pickupReference?: string;
  messageToCarrier?: string;
  internalNote: string | null;
  splitFromId: null;
  splitToId: null;
  responsibleOffice: null;
  enabledOtmMode: null;
  transportOperationsMode: null;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
  crossDock: null;
  lines?: TbrLine[];
}

export type ApprovalDecision = any;

export interface Consignee {
  parma: string;
  type: string;
  category: null | string;
  customerUnit: null;
  loadUnloadPoint: null | string;
  name: string;
  countryCode: string;
  timeZone: null | string;
  logisticsAddress: null;
  address: Address | null;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: null;
  updatedBy: null;
}

export interface Address {
  latitude: string;
  longitude: string;
  street1: string;
  street2: null;
  street3: null;
  postalCode: string;
  city: string;
  county: string;
  country: string;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: null;
  updatedBy: null;
}

export enum AtedBy {
  V0C0385 = 'v0c0385',
}

export interface OrderReleaseLine {
  releaseLineId: string;
  hashkey: string;
  articleName: string;
  articleNumber: string;
  articleDescription: string;
  packagedQuantity: string;
  purchaseOrderNumber: string;
  requestedQuantity: string;
  asnShippedQuantity: null;
  asnId: null;
  weight: string;
  weightUom: string;
  volume: null;
  volumeUom: null;
  notDelivered: boolean;
  deleted: boolean;
  additionalInternalDestination: null;
  merge: null;
  mixId: null;
  userThu: boolean;
  addedManually: null;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
}

export enum WeightUom {
  Kg = 'KG',
}

export interface ShipUnitLine {
  shipUnitLineId: string;
  dgClass: null;
  dgPackagingGroup: null;
  dgProperName: null;
  quantity: string;
  sequence: null;
  weight: string;
  weightUom: WeightUom;
  volume: string;
  volumeUom: string;
  transportHandlingUnits: TransportHandlingUnit[];
  releaseLineIds: string[];
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
}

export interface TransportHandlingUnit {
  baseType: string;
  dangerousGoods: boolean;
  hazmatUncode: null;
  description: string;
  dimensions: null;
  dimensionsUom: string;
  grossWeight: string;
  grossWeightUom: WeightUom;
  loadingMeters: null;
  loadingDirection: string;
  stackable: boolean;
  stackableRemark: null;
  stackableEnforced: boolean;
  temperatureControl: boolean;
  type: string;
  volume: string;
  volumeUom: string;
  length: string;
  lengthUom: string;
  width: string;
  widthUom: string;
  height: string;
  heightUom: string;
  articleQuantity: number;
  maxArticleQuantity: number;
  packInstructionNumber: string;
  nestable: null;
  cylindrical: null;
  subThu: boolean;
  fullThu: boolean;
  packMaterialLayer: PackMaterialLayer[];
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
}

export interface PackMaterialLayer {
  numberOfLayers: number;
  maxPackMaterialPerLayer: number;
  packMaterial: PackMaterial[];
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
}

export interface PackMaterial {
  imgUrl: string;
  materialNumber: string;
  materialDescription: string;
  numberOfUsedPackMaterial: number;
  articleQuantityPerPackageMaterial: number;
  oldMaterialNumber: string;
  parentMaterialNumber: ParentMaterialNumber;
  outerMaterial: boolean;
  weight: string;
  weightUom: WeightUom;
  length: string;
  lengthUom: null;
  width: string;
  widthUom: null;
  height: string;
  heightUom: null;
  containsPart: boolean;
  subHandlingUnit: boolean;
  packInstructionKey: string;
  mixReleaseLineRef: null;
  orderReleaseLineRef: null | string;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: AtedBy;
  updatedBy: AtedBy;
}

export enum ParentMaterialNumber {
  Empty = '',
  The000122 = '000122',
  The001121 = '001121',
  The001123 = '001123',
}

export interface TransportNetwork {
  networkId: string;
  serviceLevel: string;
  deliveryLeadTime: string;
  planningType: string;
  type: string;
  transportType: string;
  incoTerm: string;
  customs: boolean;
  doNotMerge: null;
  useLoadingMeters: boolean;
  freightClass: string;
  valid: boolean;
  id: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: null;
  updatedBy: null;
}

export interface AdditionalContact {
  contactType: string;
  name: string;
  email: string;
  phone: string;
}
