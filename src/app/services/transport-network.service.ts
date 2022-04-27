import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportNetworkService {
  constructor(private http: HttpClient) {}

  getActiveTransportNetwork(networkRel: string): Observable<any>;
  getActiveTransportNetwork(consignee: string, consignor: string, shipTo: string, deliveryDate: string): Observable<any>;
  getActiveTransportNetwork(consignee: string, consignor: string, shipTo: string, deliveryDate: string, part: string): Observable<any>;
  getActiveTransportNetwork(id: string, consignor?: string, shipTo?: string, deliveryDate?: string, part?: string): Observable<any> {
    const baseUrl = `/gateway/api/tnd/v1/transportnetwork/active/${id}`;
    const url = part ? `${baseUrl}/${consignor}/${shipTo}/${part}/${deliveryDate}` : `${baseUrl}/${consignor}/${shipTo}/${deliveryDate}`;
    return this.http.get(url);
  }

  getRelationList(id: string): Observable<any>;
  getRelationList(id: string, countryCode: string): Observable<any>;
  getRelationList(id: string, countryCode?: string): Observable<any> {
    const baseUrl = `/gateway/api/tnd/v1/transportnetwork/active/relations/${id}`;

    const url = countryCode ? `${baseUrl}/shipPoint/${countryCode}` : `${baseUrl}`;
    return this.http.get(url);
  }

  getUnloadingPoints(consignor: string, shipFrom: string): Observable<any>;
  getUnloadingPoints(consignor: string, shipFrom: string, consignee: string): Observable<any>;
  getUnloadingPoints(consignor: string, shipFrom: string, consignee?: string): Observable<any> {
    const baseUrl = `/gateway/api/tnd/v1/transportnetwork/active/relations/unloadingPoints/${consignor}`;
    const url = consignee ? `${baseUrl}/${consignee}/${shipFrom}` : `${baseUrl}/${shipFrom}`;
    return this.http.get(url);
  }

  getActiveShipFromList(consignor: string): Observable<any> {
    return this.http.get(`/gateway/api/tnd/v1/transportnetwork/active/relations/shipFroms/${consignor}`);
  }

  getActiveRelationByParma(id: string): Observable<any> {
    return this.http.get(`/gateway/api/tnd/v1/transportnetwork/active/relation/${id}`);
  }

  getActiveShipPointByParma(id: string): Observable<any> {
    return this.http.get(`/gateway/api/tnd/v1/transportnetwork/active/relation/shipPoint/${id}`);
  }

  getUnloadingPointsForShipPoint(id: string): Observable<any> {
    return this.http.get(`/gateway/api/tnd/v1/transportnetwork/active/relation/shipPoint/${id}/unloadingPoints`);
  }

  getActiveTransportNetworksForAuto(consignee: string, consignor: string, unloadPoint: string, deliveryDate: string): Observable<any> {
    return this.http.get(`/gateway/api/tnd/v1/transportnetwork/active/auto/${consignee}/${consignor}/${unloadPoint}/${deliveryDate}`);
  }
}
