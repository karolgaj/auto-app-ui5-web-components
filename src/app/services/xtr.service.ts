import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TbrLightDetails } from '../models/tbr-light.model';
import { HazmatDetails, Tbr, TransportParty } from '../models/tbr.model';
import { ThuDetails } from '../models/thu-details';

import { PartyLocation } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class XtrService {
  constructor(private http: HttpClient) {}

  /* POST METHODS */

  saveXTR(tbr: Tbr): Observable<Tbr> {
    return this.http.post<Tbr>('/gateway/api/xtr/v3/xtr', tbr);
  }

  /* PUT METHODS */

  setManualTHU(shipItId: string, releaseLineId: string, pi: ThuDetails): Observable<Tbr> {
    return this.http.put<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/manual/thu/${releaseLineId}`, pi);
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

  deleteHazmatDetails(shipItId: string, releaseLineId: string): Observable<Tbr> {
    return this.http.delete<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/hazmat/${releaseLineId}`);
  }

  /* GET METHODS */
  createEmptyBooking(): Observable<Partial<Tbr> & Required<{ shipitId: string }>> {
    return this.http.get<Partial<Tbr> & Required<{ shipitId: string }>>('/gateway/api/xtr/v3/xtr/new');
  }

  updateUnloadingPoint(shipitId: string, unloadingPoint: string): Observable<any> {
    return this.http.get(`/gateway/api/location/v3/xtr/${shipitId}/shipto/${unloadingPoint}`);
  }

  getListOfShipFrom(): Observable<PartyLocation[]> {
    return this.http.get<PartyLocation[]>('/gateway/api/tnd/v3/location/SHIP_FROM');
  }

  getListOfShipTo(): Observable<PartyLocation[]> {
    return this.http.get<PartyLocation[]>('/gateway/api/tnd/v3/location/SHIP_TO');
  }

  getListOfConsignors(): Observable<PartyLocation[]> {
    return this.http.get<PartyLocation[]>('/gateway/api/tnd/v3/location/CONSIGNOR');
  }

  getListOfUnloadingPoints(parmaId: string): Observable<string[]> {
    return this.http.get<string[]>(`/gateway/api/location/v3/location/unloadpoint/${parmaId}`);
  }

  getListOfConsignees(shipToParma: string): Observable<PartyLocation[]> {
    return this.http.get<PartyLocation[]>(`/gateway/api/tnd/v3/location/consignee/${shipToParma}`);
  }

  getShipFromLocation(shipItId: string, parmaId: string): Observable<TransportParty> {
    return this.http.get<TransportParty>(`/gateway/api/location/v3/location/${shipItId}/SHIP_FROM/${parmaId}`);
  }

  getShipToLocation(shipItId: string, parmaId: string): Observable<TransportParty> {
    return this.http.get<TransportParty>(`/gateway/api/location/v3/location/${shipItId}/SHIP_TO/${parmaId}`);
  }

  getConsignorLocation(shipItId: string, parmaId: string): Observable<TransportParty> {
    return this.http.get<TransportParty>(`/gateway/api/location/v3/location/${shipItId}/CONSIGNOR/${parmaId}`);
  }

  getConsigneeLocation(shipItId: string, parmaId: string): Observable<TransportParty> {
    return this.http.get<TransportParty>(`/gateway/api/location/v3/location/${shipItId}/CONSIGNEE/${parmaId}`);
  }

  getXtrs(): Observable<TbrLightDetails[]> {
    return this.http.get<TbrLightDetails[]>(`/gateway/api/xtr/v3/xtr`);
  }

  splitLinesAndTransferToNewTBR(shipItId: string): Observable<any> {
    return this.http.get(`/gateway/api/xtr/v3/xtr/${shipItId}/split/{shipUnitLines}`);
  }

  setPickupAndDeadlineDate(
    shipItId: string,
    pickupDate: string,
    deadlineDate: string | null,
    deadlineTime: string | null
  ): Observable<any> {
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

  deleteLine(shipItId: string, releaseLineId: string): Observable<Tbr> {
    return this.http.get<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/line/delete/${releaseLineId}`);
  }

  addLine(shipItId: string, purchaseOrderNumber: string, partNumber: string, quantity: number): Observable<Tbr> {
    return this.http.get<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/line/add/${purchaseOrderNumber}/${partNumber}/${quantity}`);
  }

  addLineWithoutPartNumber(shipItId: string, description: string, plannedQty: number, weight: string): Observable<Tbr> {
    return this.http.get<Tbr>(`/gateway/api/xtr/v3/xtr/${shipItId}/line/add/other/${description}/${plannedQty}/${weight}`);
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
