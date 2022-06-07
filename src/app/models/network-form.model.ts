import { NetworkType, PlanningType, ServiceLevel, TransportType } from './network.model';

export interface NetworkForm {
  consignor: string;
  consignee: string;
  shipFrom: string;
  shipTo: string;
  unloadingPoint: string;
  loadingPoint: string;
  pickupDate: string;
  customs: boolean;
  useLoadingMeters: boolean;
  doNotMerge: boolean;
  freightClass: string;
  payer: string;
  transportType: TransportType;
  planningType: PlanningType;
  type: NetworkType;
  serviceLevel: ServiceLevel;
}
