export interface TbrLight {
  status: string;
  details: TbrLightDetails[];
  parmas: string;
}

export interface TbrLightDetails {
  tbId: null;
  tbrId: null;
  consigneeId: string;
  consigneeCountryCode: string;
  consigneeName: string;
  consignorId: string;
  consignorCountryCode: string;
  consignorName: string;
  shipFromId: string;
  shipFromCountryCode: string;
  shipFromName: string;
  shipToId: string;
  shipToCountryCode: string;
  shipToName: string;
  deliveryDate: string;
  tbrType: string;
  originalDeliveryDate: string;
  unloadingPoint: string;
  unloadingPointName: string;
  shipitStatus: string;
  shipitStatusType: string;
  shipitId: string;
  split: boolean;
  splitFromId: null;
  orderWeight: string;
  orderWeightUom: string;
  orderVolume: string;
  orderVolumeUom: string;
  createdBy: string;
  shipToAddress: ShipAddress;
  shipFromAddress: ShipAddress;
}

export interface ShipAddress {
  latitude: null;
  longitude: null;
  street1: string;
  street2: null;
  street3: null;
  postalCode: string;
  city: string;
  county: null;
  country: string;
  id: null;
  version: null;
  createdAt: null;
  updatedAt: null;
  createdBy: null;
  updatedBy: null;
}
