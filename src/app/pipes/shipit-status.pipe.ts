import { Pipe, PipeTransform } from '@angular/core';
import { ShipitStatus } from '../models/tbr-type.model';

@Pipe({
  name: 'shipitStatus',
  pure: true,
})
export class ShipitStatusPipe implements PipeTransform {
  transform(value: ShipitStatus, type: 'value' | 'color' = 'value'): string {
    if (type === 'value') {
      switch (value) {
        case 'CREATED':
          return 'Created';
        case 'IN_PROCESS':
          return 'In Process';
        default:
          return '';
      }
    } else {
      switch (value) {
        case 'CREATED':
          return '#e78c07';
        case 'IN_PROCESS':
          return '#2b7c2b';
        default:
          return '';
      }
    }
  }
}
