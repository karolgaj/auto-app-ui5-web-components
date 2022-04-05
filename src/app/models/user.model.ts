export type UserRole =
  | 'ADMIN'
  | 'ANALYSIS'
  | 'BCT_MONITORING'
  | 'CONSIGNOR'
  | 'MATERIAL_CONTROLLER'
  | 'MATERIAL_SUPPLIER'
  | 'MATERIAL_SUPPLIER_PMR'
  | 'ROLL_OUT_EXPRESS'
  | 'SUPER_USER'
  | 'SUPPORT'
  | 'TRANSPORT_OPERATIONS'
  | 'USER_ADMINISTRATION';

export type SystemOfMeasurement = 'METRIC' | 'IMPERIAL';

export interface UserData {
  userId: string;
  version: number;
  roles: UserRole[];
  consigneeParmas: string[];
  consignorParmas: string[];
  systemOfMeasurement: SystemOfMeasurement;
  // "isoLagnuage": [ en_US, se_SV, fr_FR ]
  dateFormat: string;
  timeFormat: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  phone: string;
}
