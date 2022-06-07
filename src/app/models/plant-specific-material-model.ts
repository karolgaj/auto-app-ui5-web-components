export interface PlantSpecificMaterial {
  materialNumber: string;
  oldMaterialNumber: string;
  length: number;
  width: number;
  height: number;
  unitOfMeasure: string;
  stackable: boolean;
  subHu: boolean;
  materialOwner: string;
  sandwich: boolean;
  loadingDirection: string;
  outerMaterial: boolean;
  materialUser?: string[] | null;
  description: string;
  werks: string;
}
