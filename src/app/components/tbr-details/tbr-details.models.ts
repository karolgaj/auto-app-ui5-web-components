import { IFormControl } from '@rxweb/types';
import { TbrLine } from 'src/app/models/tbr-line.model';

export type AddLineOptionValue = 'VolvoPart' | 'OtherPart';
export const WORKFLOW_STATUSES_FOR_SUMMARY = [
  'SENT_FOR_APPROVAL',
  'CREATED',
  'APPROVAL_REJECTED',
  'RO_APPROVAL_REJECTED',
  'APPROVAL_IN_PROCESS',
];

export interface AddLineForm {
  partNo: string;
  plannedQty: number;
  poNumber: string;
  description: string;
  weight: string;
}

export interface AddLineOptions {
  text: string;
  value: AddLineOptionValue;
}

export interface AddRefForm {
  msgToCarrier: string;
  pickupRef: string;
  dispatchAdviceNumber: string;
  orderNumber: string;
  doNotMerge: string;
}

export interface CustomThuForm {
  width: number;
  length: number;
  height: number;
  weight: number;
  unitLoad: number;
  stackable: boolean;
}

export interface ExtendedTbrLine extends TbrLine {
  packagedQuantityControl: IFormControl<string>;
  typeControl: IFormControl<string>;
}

export interface ExtendedPackMaterial {
  qtyOfLayersControl: IFormControl<number>;
  unitLoadPerPackMatControl: IFormControl<number>;
  containsPartPackMatControl: IFormControl<string>;
}
