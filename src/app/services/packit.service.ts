import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransportHandlingUnit } from '../models/transport-handling-unit.model';
import { ThuDetails } from '../models/thu-details';
import { SubTransportHandlingUnit } from '../models/sub-transport-handling-unit.model';
import { PlantSpecific } from '../models/plant-specific-model';

@Injectable({ providedIn: 'root' })
export class PackItService {
  constructor(private http: HttpClient) {}

  getTHUById(thuId: string, shipFrom: string): Observable<ThuDetails> {
    return this.http.get<ThuDetails>(`/gateway/api/packit/v1/thu/${thuId}/${shipFrom}`);
  }
  getTHUListByShipFrom(shipFrom: string): Observable<TransportHandlingUnit[]> {
    return this.http.get<TransportHandlingUnit[]>(`/gateway/api/packit/v1/thu/list/${shipFrom}`);
  }
  getSubTHUById(shipFrom: string): Observable<SubTransportHandlingUnit[]> {
    return this.http.get<SubTransportHandlingUnit[]>(`/gateway/api/packit/v1/thu/list/sub/thu/${shipFrom}`);
  }

  getPlantSpecificTHUListForMaterialNumber(materialNumber: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/plantspecific/description/${materialNumber}`);
  }
  getPlantSpecificTHUListForShipFrom(): Observable<PlantSpecific[]> {
    return this.http.get<PlantSpecific[]>(`/gateway/api/packit/v1/plantspecific/list`);
  }

  getPartInformationByPartNumber(partNumber: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/partinformation/${partNumber}`);
  }
  getPartDescriptionByPartNumber(partNumber: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/partinformation/description/${partNumber}`);
  }

  getPartInstructions(consignee: string, consignor: string, partNumber: string, deliveryDate: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/packinstruction/${consignee}/${consignor}/${partNumber}/${deliveryDate}`);
  }
}
