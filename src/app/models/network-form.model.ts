export type TransportType = 'FCL' | 'FTL' | 'LCL' | 'LTL' | 'MIX';
export type PlanningType = 'EXPRESS' | 'INBOUND' | 'OUTBOUND';
export type ServiceLevel = 'CLOSED_LOOP' | 'STD_INB';

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
  transportType: TransportType;
  planningType: PlanningType;
  serviceLevel: ServiceLevel;
}
