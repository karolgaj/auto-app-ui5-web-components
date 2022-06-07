export type TransportType = 'FCL' | 'FTL' | 'LCL' | 'LTL' | 'MIX';
export type NetworkType = 'EXPRESS' | 'INBOUND' | 'OUTBOUND';
export type ServiceLevel = 'CLOSED_LOOP' | 'STD_INB';
export type PlanningType = 'DDT' | 'DDT_DP' | 'DDT_OCEAN' | 'PCT' | 'PCT_DP' | 'PCT_OCEAN';

export interface Network {
  networkId: string | null;
  serviceLevel: ServiceLevel;
  deliveryLeadTime: string | null;
  planningType: PlanningType;
  type: NetworkType;
  transportType: TransportType;
  incoTerm: string | null;
  customs: boolean;
  doNotMerge: boolean;
  useLoadingMeters: boolean;
  freightClass: string;
  valid: boolean;
}
