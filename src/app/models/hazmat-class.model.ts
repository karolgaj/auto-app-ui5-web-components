export interface HazmatClass {
  class: string;
  name: string;
  subClass?: HazmatClassSubCodes[] | null;
}
export interface HazmatClassSubCodes {
  class: string;
  name: string;
  description?: string | null;
  alternatePlacard: boolean;
  imageUri: string;
}
