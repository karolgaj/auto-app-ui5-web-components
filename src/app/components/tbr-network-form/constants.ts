import { SelectionOption } from '../../models/selection-option.model';
import { NetworkType, ServiceLevel, TransportType } from '../../models/network.model';

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

export const PLANNING_TYPE_OPTIONS: SelectionOption<NetworkType>[] = [
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
