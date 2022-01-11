import { Pipe, PipeTransform } from '@angular/core';
import { Consignee } from '../models/tbr.model';

@Pipe({
  name: 'consignorText',
  pure: true,
})
export class ConsignorTextPipe implements PipeTransform {
  transform(value: Consignee): string {
    return `${value.parma} - ${value.name}`;
  }
}
