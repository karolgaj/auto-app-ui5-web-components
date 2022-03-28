export interface ReasonCodePayload {
  status: string;
  details?: ReasonCodesDetails[];
}
export interface ReasonCodesDetails {
  payer: string;
  reasonCodes: ReasonCode[];
}
export interface ReasonCode {
  generalCode: number;
  cause: string;
  subCodes?: SubCode[] | null;
}
export interface SubCode {
  code: number;
  description: string;
  secondSubCodes?: (SecondSubCode | null)[] | null;
}
export interface SecondSubCode {
  code: number;
  description: string;
}
