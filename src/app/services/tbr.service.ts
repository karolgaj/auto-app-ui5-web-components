import { Injectable } from '@angular/core';
// @ts-ignore
import * as tbrList from './mocks/tbr-list.mock-data.json';
// @ts-ignore
import * as details from './mocks/tbr-details.mock-data.json';
// @ts-ignore
import * as tbrNetworks from './mocks/tbr-network.mock-data.json';
// @ts-ignore
import * as reasonCodes from './mocks/reason-codes-data.json';
import { Observable, of } from 'rxjs';
import { TbrLightDetails } from '../models/tbr-light.model';
import { OrderReleaseLine, ShipUnitLine, Tbr } from '../models/tbr.model';
import { map } from 'rxjs/operators';
import { TbrLine } from '../models/tbr-line.model';
import { TbrNetwork } from '../models/tbr-network.model';
import { NetworkForm } from '../models/network-form.model';
import { ReasonCodePayload } from '../models/reason-code.model';
import { HttpClient } from '@angular/common/http';

const tbrsList = tbrList;
const tbrDetails = details;

@Injectable({ providedIn: 'root' })
export class TbrService {
  constructor(private http: HttpClient) {}

  testCall() {
    this.http.get('/gateway/api/xtr/v1/xtr/shipit/XTRM000000010920220328112555437').subscribe(console.log);
  }

  getReasonCodes(): Observable<ReasonCodePayload> {
    return of(reasonCodes.default as ReasonCodePayload);
  }

  getTbrNetworks(): Observable<TbrNetwork[]> {
    return of(tbrNetworks.default as TbrNetwork[]);
  }

  getTbrList(parmas: string[]): Observable<TbrLightDetails[]> {
    return of(tbrsList.details as TbrLightDetails[]);
  }

  getTbrDetails(shipitId: string): Observable<Tbr> {
    return of(tbrDetails as Tbr).pipe(
      map((tbr) => {
        return {
          ...tbr,
          lines: TbrService.mapToLines(tbr),
        };
      })
    );
  }

  private static mapToLines(tbr: Tbr): TbrLine[] {
    const orderReleaseLines = tbr.orderReleaseLines;
    const aTBRlines: TbrLine[] = [];
    let aSubHUs: any[] = [];
    let totalTHUs = 0;
    orderReleaseLines.forEach((oORL) => {
      const aSUL = tbr.shipUnitLines.filter((element) =>
        element.releaseLineIds.some((subElement) => subElement.includes(oORL.releaseLineId))
      );

      const res = TbrService.mapTBRline(oORL, aSUL, aTBRlines);
      if (res && res.aSubHU && res.oTBRline) {
        aSubHUs = aSubHUs.concat(res.aSubHU);
        let oTBRline = res.oTBRline;
        oTBRline.tbrType = tbr.tbrType;
        aTBRlines.push(oTBRline);
      }
    });
    return aTBRlines;
  }

  private static mapTBRline(oORL: OrderReleaseLine, aSUL: ShipUnitLine[], aTBRlines: TbrLine[]) {
    let oTBRline: any = {
      releaseLineId: oORL.releaseLineId,
      additionalInternalDestination: oORL.additionalInternalDestination,
      articleNumber: oORL.articleNumber,
      articleName: oORL.articleName,
      requestedQuantity: oORL.requestedQuantity,
      packagedQuantity: oORL.packagedQuantity,
      purchaseOrderNumber: oORL.purchaseOrderNumber,
      weight: oORL.weight, //This is the PART weight
      weightUom: oORL.weightUom, //And this is the PART weight Uom
      notDelivered: oORL.notDelivered,
      //200160
      shipitLine: true,
      deleted: oORL.deleted,
      userThu: oORL.userThu,
      // Prepare for SUL calculations:
      quantity: 0,
      weightSUL: 0,
      volumeSUL: 0,
      // For THU type and shipQty validation. Default is that all is ok
      valueStateTHU: 'None',
      valueStateQty: 'None',
      whLoc: oORL.additionalInternalDestination,
    };

    let bMixed = false;
    let iMixedIdx = -1;
    if (aSUL.length == 1 && aSUL[0].releaseLineIds.length > 1) {
      bMixed = true;
      // find index if SUL already is mapped
      iMixedIdx = aTBRlines.findIndex((line: any) => line.shipUnitLineId == aSUL[0].shipUnitLineId);
    }

    if (bMixed) {
      oTBRline.mixValid = false;
      oTBRline.shipUnitLineId = aSUL[0].shipUnitLineId;
    }

    let aSubHU: { id: any; oldMaterialNumber: any; releaseLineId: any; additionalInternalDestination: any }[] = [];

    // Map SUL data to oTBRline(s)

    for (var j = 0; j < aSUL.length; j++) {
      if (!bMixed) {
        oTBRline.quantity = oTBRline.quantity + Number(aSUL[j].quantity);
        oTBRline.weightSUL = oTBRline.weightSUL + Number(aSUL[j].weight); //(Number(aSUL[j].weight) * Number(aSUL[j].quantity));
        oTBRline.volumeSUL = oTBRline.volumeSUL + Number(aSUL[j].volume); //(Number(aSUL[j].volume) * Number(aSUL[j].quantity));
      } else {
        if (iMixedIdx < 0) {
          // SUL not mapped yet
          oTBRline.quantity = oTBRline.quantity + Number(aSUL[j].quantity);
          oTBRline.weightSUL = oTBRline.weightSUL + Number(aSUL[j].weight); //(Number(aSUL[j].weight) * Number(aSUL[j].quantity));
          oTBRline.volumeSUL = oTBRline.volumeSUL + Number(aSUL[j].volume); //(Number(aSUL[j].volume) * Number(aSUL[j].quantity));
        } else {
          // modify the TBR line already added (in mapTBRlines, after the lines have been added to the table)
          let oMixedLine = aTBRlines[iMixedIdx];
          oMixedLine.articleNumber = oMixedLine.articleNumber + '\n' + oTBRline.articleNumber;
          oMixedLine.articleName = oMixedLine.articleName + '\n' + oTBRline.articleName;
          oMixedLine.requestedQuantity = oMixedLine.requestedQuantity + '\n' + oTBRline.requestedQuantity;
          oMixedLine.packagedQuantity = oMixedLine.packagedQuantity + '\n' + oTBRline.packagedQuantity;
          oMixedLine.purchaseOrderNumber = oMixedLine.purchaseOrderNumber + '\n' + oTBRline.purchaseOrderNumber;
          return;
        }
      }

      if (j === 0) {
        // If 1:1 => always use this THU type, if 1:2 => use the first since that's the full THU
        // Same goes for Uom
        if (aSUL[j].transportHandlingUnits[0]) {
          oTBRline.baseType = aSUL[j].transportHandlingUnits[0].baseType;
          oTBRline.type = aSUL[j].transportHandlingUnits[0].type;
          oTBRline.stackable = aSUL[j].transportHandlingUnits[0].stackable;
        }
        oTBRline.weightSULUom = aSUL[j].weightUom ? aSUL[j].weightUom : 'KG';
        oTBRline.volumeSULUom = aSUL[j].volumeUom ? aSUL[j].volumeUom : 'M3';
        let oSubHu;
        if (aSUL[j].transportHandlingUnits[0] && aSUL[j].transportHandlingUnits[0].packMaterialLayer) {
          oSubHu = aSUL[j].transportHandlingUnits[0].packMaterialLayer.find((layer) =>
            layer.packMaterial.find((element) => {
              return element.subHandlingUnit;
            })
          );
        }

        if (oSubHu) {
          oTBRline.subHu = oSubHu.packMaterial[0].oldMaterialNumber;
        } else {
          oTBRline.subHu = '';
        }
      }
      if (!bMixed && aSUL[j].transportHandlingUnits[0] && aSUL[j].transportHandlingUnits[0].packMaterialLayer) {
        aSUL[j].transportHandlingUnits[0].packMaterialLayer.forEach((layer) => {
          layer.packMaterial.forEach((packMat) => {
            if (packMat.subHandlingUnit) {
              aSubHU.push({
                id: aSUL[j].id,
                oldMaterialNumber: packMat.oldMaterialNumber,
                releaseLineId: aSUL[j].releaseLineIds[0],
                additionalInternalDestination: oTBRline.additionalInternalDestination,
              });
            }
          });
        });
      }
      if (oTBRline.type === '' || oTBRline.type === null || typeof oTBRline.type === 'undefined') {
        oTBRline.valueStateTHU = 'Error';
      } else {
        oTBRline.valueStateTHU = 'None';
      }
    }

    return {
      oTBRline,
      aSubHU,
    };
  }

  getConsignors() {
    return of([
      {
        info: 'some info',
        parma: '1234',
        name: 'VOLVO',
      },
      {
        info: 'some info',
        parma: '1234',
        name: 'VOLVO',
      },
    ]);
  }

  getUnloadingPoints(data: NetworkForm) {
    return of([
      {
        info: 'some info',
        parma: 'asd',
        name: 'Name2',
      },
      {
        info: 'some info',
        parma: 'sdfsd',
        name: 'Name1',
      },
    ]);
  }

  getShipItems() {
    return of([
      {
        info: 'ship item 1',
        parma: 'ship parma 1',
        name: 'Name1',
      },
      {
        info: 'ship item 2',
        parma: 'ship Parma 2',
        name: 'Name2',
      },
    ]);
  }

  createTbr(data: any) {
    return of(data);
  }
}
