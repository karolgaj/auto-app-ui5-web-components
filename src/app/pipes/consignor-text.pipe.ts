import { Pipe, PipeTransform } from '@angular/core';
import { TransportParty } from '../models/tbr.model';

@Pipe({
  name: 'consignorText',
  pure: true,
})
export class ConsignorTextPipe implements PipeTransform {
  transform(value: TransportParty): string {
    return `${value.parma} - ${value.name}`;
  }
}
