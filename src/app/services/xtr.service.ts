import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TbrLightDetails } from '../models/tbr-light.model';
import { HazmatDetails, Tbr } from '../models/tbr.model';

@Injectable({
  providedIn: 'root',
})
export class XtrService {
  constructor(private http: HttpClient) {}

  /* POST METHODS */

  saveXTR(tbr: Tbr): Observable<Tbr> {
    return this.http.post<Tbr>('/gateway/api/xtr/v3/xtr', tbr);
  }

  searchTBRs(search: string, consigneeIds: string[], consignorIds: string[]): Observable<any> {
    return this.http.post('/gateway/api/xtr/v3/search/xtr', {
      search,
      consigneeIds,
      consignorIds,
    });
  }

  searchTBs(search: string, consigneeIds: string[], consignorIds: string[]): Observable<any> {
    return this.http.post('/gateway/api/xtr/v3/search/tb', {
      search,
      consigneeIds,
      consignorIds,
    });
  }

  /* PUT METHODS */

  setManualTHU(shipItId: string): Observable<any> {
    return this.http.put(`/gateway/api/xtr/v3/xtr/${shipItId}/manual/thu/{releaseLine}`, {});
  }

  addHazmatDetails(shipItId: string, releaseLineId: string, hazmatDetails: HazmatDetails): Observable<Tbr> {
    return this.http.put<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/hazmat/${releaseLineId}`, hazmatDetails);
  }

  /* PATCH METHODS */

  updateReference(shipItId: string, pickupReference: string, messageToCarrier: string): Observable<any> {
    return this.http.patch(`/gateway/api/xtr/v3/xtr/${shipItId}/pickup/references`, {
      pickupReference,
      messageToCarrier,
    });
  }

  /* DELETE METHODS */

  deleteOldXTRs(): Observable<any> {
    return this.http.delete('/gateway/api/xtr/v3/xtr');
  }

  deleteHazmatDetails(shipItId: string, releaseLineId: string): Observable<Tbr> {
    return this.http.delete<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/hazmat/${releaseLineId}`);
  }

  /* GET METHODS */

  getXtrs(): Observable<TbrLightDetails[]> {
    return this.http.get<TbrLightDetails[]>(`/gateway/api/xtr/v3/xtr`);
  }

  splitLinesAndTransferToNewTBR(shipItId: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/split/{shipUnitLines}`);
  }

  setPickupAndDeadlineDate(shipItId: string, pickupDate: string, deadlineDate: string, deadlineTime: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/pickup/${pickupDate}/deadline/${deadlineDate}/${deadlineTime}`);
  }

  mixPartsInTHU(shipItId: string, shipUnitLines: string[]): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/lines/mix/${shipUnitLines}`);
  }

  breakMixedTHU(shipItId: string, shipUnitLine: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/lines/mix/break/${shipUnitLine}`);
  }

  setPackagedQuantityForLine(shipItId: string, releaseLine: string, quantity: number): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/line/${releaseLine}/${quantity}`);
  }

  splitLine(shipItId: string, releaseLine: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/line/split/${releaseLine}`);
  }

  deleteLine(shipItId: string, releaseLineId: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/line/delete/${releaseLineId}`);
  }

  addLine(shipItId: string, purchaseOrderNumber: string, partNumber: string, quantity: number): Observable<Tbr> {
    return this.http.get<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/line/add/${purchaseOrderNumber}/${partNumber}/${quantity}`);
  }

  getXtrByShipItId(shipItId: string): Observable<Tbr> {
    return this.http.get<Tbr>(`/gateway/api/xtr/v3/xtr/shipit/${shipItId}`);
  }

  getXTRsForResponsibleOffice(responsibleOffice: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/responsibleoffice/${responsibleOffice}`);
  }

  getListOfConfirmedTbs(): Observable<any> {
    return this.http.get('/gateway/api/xtr/v3/tb');
  }
}
