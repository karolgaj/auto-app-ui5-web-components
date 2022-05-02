import { ShipItStatusType, ShipItStatusTypeName } from '../../models/tbr-type.model';

export const ShipItStatusTypeMap: Record<ShipItStatusTypeName, ShipItStatusType | ShipItStatusType[]> = {
  'For Approval': 'FOR_APPROVAL',
  Approved: 'APPROVED',
  Confirmed: 'CONFIRMED',
  Drafts: ['CREATED', 'DRAFT'],
  Planned: 'PLANNED',
  Planning: 'PLANNING',
  Rejected: 'REJECTED',
  Speedups: 'SPEEDUP',
  'Approval Request': ['APPROVAL_REQUEST', 'APPROVAL_WORKFLOW'],
};
