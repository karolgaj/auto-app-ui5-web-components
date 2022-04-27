import { SelectionOption } from '../../models/selection-option.model';
import { PlanningType, ServiceLevel, TransportType } from '../../models/network-form.model';

export const SERVICE_LEVEL_OPTIONS: SelectionOption<ServiceLevel>[] = [
  {
    text: 'Standard Inbound',
    value: 'STD_INB',
  },
  {
    text: 'Closed Loop',
    value: 'CLOSED_LOOP',
  },
];
export const TRANSPORT_TYPE_OPTIONS: SelectionOption<TransportType>[] = [
  {
    text: 'FCL',
    value: 'FCL',
  },
  {
    text: 'FTL',
    value: 'FTL',
  },
  {
    text: 'LCL',
    value: 'LCL',
  },
  {
    text: 'LTL',
    value: 'LTL',
  },
  {
    text: 'MIX',
    value: 'MIX',
  },
];

export const PLANNING_TYPE_OPTIONS: SelectionOption<PlanningType>[] = [
  {
    text: 'Express',
    value: 'EXPRESS',
  },
  {
    text: 'Inbound',
    value: 'INBOUND',
  },
  {
    text: 'Outbound',
    value: 'OUTBOUND',
  },
];

export const NEW_XTR: any = {
  details: {
    consignee: {},
    consignor: {},
    involvedParties: [],
    otmTransmissionAcks: [],
    advancedShippingNotices: [],
    shipFrom: {
      address: {},
    },
    shipTo: {
      category: 'UNLOADING_POINT',
    },
    transportNetwork: {
      valid: true,
    },
    shipUnitLines: [],
    orderReleaseLines: [],
    transportBookings: [],
    tbrType: 'MANUAL_EXPRESS',
    expressType: 'NORMAL',
    orderType: 'TBR',
    shipitStatus: 'CREATED',
    shipitStatusType: 'DRAFT',
    qualifiersTBR: [],
    calloffMode: false,
    totals: {
      totalCount: 0,
      totalVolume: 0,
      totalWeight: 0,
    },
  },
  status: 'NEW',
};
