export interface TbrNetwork {
  consigneeId: string;
  consigneeName: string;
  consigneeCountryCode: string;
  consignorId: string;
  consignorName: string;
  consignorCountryCode: string;
  shipFromId: string;
  shipFromName: string;
  shipFromCity: string;
  shipFromCountryCode: string;
  shipFromTimeZone: string;
  shipToId: string;
  shipToName: string;
  shipToCity: string;
  shipToCountryCode: string;
  unloadingPoint: string;
  validFrom: string;
  validTo?: null;
  trpType: string;
  category?: null;
  trpOrderType: string;
  incoTerm: string;
  collectionDays: string;
  networkRel: number;
  leadTimeWeekdays: string;
  altCollectionDays?: AltCollectionDaysEntity[] | null;
}
export interface AltCollectionDaysEntity {
  networkRelation: string;
  collectionDate: string;
  collectionDay: number;
  defaultDay: number;
  week: string;
  countryCode: string;
  updateMethod: string;
}
