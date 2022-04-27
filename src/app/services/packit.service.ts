import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor(private http: HttpClient) {}

  getTHUById(thuId: string, shipFrom: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/thu/${thuId}/${shipFrom}`);
  }
  getTHUListByShipFrom(shipFrom: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/thu/list/${shipFrom}`);
  }
  getSubTHUById(shipFrom: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/thu/list/sub/thu/${shipFrom}`);
  }

  getPlantSpecificTHUListForMaterialNumber(materialNumber: string): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/plantspecific/description/${materialNumber}`);
  }
  getPlantSpecificTHUListForShipFrom(): Observable<any> {
    return this.http.get(`/gateway/api/packit/v1/plantspecific/list`);
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
