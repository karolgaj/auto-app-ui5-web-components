import { Pipe, PipeTransform } from '@angular/core';
import { TbrType } from '../models/tbr-type.model';
import { TbrLightDetails } from '../models/tbr-light.model';

@Pipe({
  name: 'tbrType',
  pure: true,
})
export class TbrTypePipe implements PipeTransform {
  transform(value: null | TbrLightDetails[], tbrType: TbrType): TbrLightDetails[] {
    if (value) {
      return value.filter((tbr) => {
        if (tbrType === 'Drafts') {
          return tbr.shipitStatusType === 'DRAFT';
        } else {
          return tbr.shipitStatusType === tbrType;
        }
      });
    }
    return [];
  }
}
