import { OrderReleaseLine, ShipUnitLine, Tbr } from '../models/tbr.model';
import { TbrLine } from '../models/tbr-line.model';

function mapTBRLine(
  oORL: OrderReleaseLine,
  aSUL: ShipUnitLine[],
  aTBRlines: TbrLine[]
): {
  oTBRline: any;
  aSubHU: any;
} {
  const oTBRline: any = {
    releaseLineId: oORL.releaseLineId,
    additionalInternalDestination: oORL.additionalInternalDestination,
    articleNumber: oORL.articleNumber,
    articleName: oORL.articleName,
    requestedQuantity: oORL.requestedQuantity,
    packagedQuantity: oORL.packagedQuantity,
    purchaseOrderNumber: oORL.purchaseOrderNumber,
    weight: oORL.weight, // This is the PART weight
    weightUom: oORL.weightUom, // And this is the PART weight Uom
    notDelivered: oORL.notDelivered,
    // 200160
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
    dangerousGoods: oORL.dangerousGoods,
    whLoc: oORL.additionalInternalDestination,
  };

  let bMixed = false;
  let iMixedIdx = -1;
  if (aSUL.length === 1 && aSUL[0].releaseLineIds.length > 1) {
    bMixed = true;
    // find index if SUL already is mapped
    iMixedIdx = aTBRlines.findIndex((line: any) => line.shipUnitLineId === aSUL[0].shipUnitLineId);
  }

  if (bMixed) {
    oTBRline.mixValid = false;
    oTBRline.shipUnitLineId = aSUL[0].shipUnitLineId;
  }

  const aSubHU: { id: any; oldMaterialNumber: any; releaseLineId: any; additionalInternalDestination: any }[] = [];

  // Map SUL data to oTBRline(s)

  for (let j = 0; j < aSUL.length; j++) {
    if (!bMixed) {
      oTBRline.quantity += Number(aSUL[j].quantity);
      oTBRline.weightSUL += Number(aSUL[j].weight); // (Number(aSUL[j].weight) * Number(aSUL[j].quantity));
      oTBRline.volumeSUL += Number(aSUL[j].volume); // (Number(aSUL[j].volume) * Number(aSUL[j].quantity));
    } else if (iMixedIdx < 0) {
      // SUL not mapped yet
      oTBRline.quantity += Number(aSUL[j].quantity);
      oTBRline.weightSUL += Number(aSUL[j].weight); // (Number(aSUL[j].weight) * Number(aSUL[j].quantity));
      oTBRline.volumeSUL += Number(aSUL[j].volume); // (Number(aSUL[j].volume) * Number(aSUL[j].quantity));
    } else {
      // modify the TBR line already added (in mapTBRlines, after the lines have been added to the table)
      const oMixedLine = aTBRlines[iMixedIdx];
      oMixedLine.articleNumber = `${oMixedLine.articleNumber}\n${oTBRline.articleNumber}`;
      oMixedLine.articleName = `${oMixedLine.articleName}\n${oTBRline.articleName}`;
      oMixedLine.requestedQuantity = `${oMixedLine.requestedQuantity}\n${oTBRline.requestedQuantity}`;
      oMixedLine.packagedQuantity = `${oMixedLine.packagedQuantity}\n${oTBRline.packagedQuantity}`;
      oMixedLine.purchaseOrderNumber = `${oMixedLine.purchaseOrderNumber}\n${oTBRline.purchaseOrderNumber}`;
      return {
        oTBRline: null,
        aSubHU: null,
      };
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

export function mapToLines(tbr: Tbr): TbrLine[] {
  const { orderReleaseLines } = tbr;
  const aTBRlines: TbrLine[] = [];
  let aSubHUs: any[] = [];
  orderReleaseLines.forEach((oORL) => {
    const aSUL = tbr.shipUnitLines.filter((element) =>
      element.releaseLineIds.some((subElement) => subElement.includes(oORL.releaseLineId))
    );

    const res = mapTBRLine(oORL, aSUL, aTBRlines);
    if (res && res.aSubHU && res.oTBRline) {
      aSubHUs = aSubHUs.concat(res.aSubHU);
      const { oTBRline } = res;
      oTBRline.tbrType = tbr.tbrType;
      aTBRlines.push(oTBRline);
    }
  });
  return aTBRlines;
}
