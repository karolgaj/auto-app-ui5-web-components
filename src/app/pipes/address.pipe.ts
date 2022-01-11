import { Pipe, PipeTransform } from '@angular/core';
import { Consignee } from '../models/tbr.model';

@Pipe({
  name: 'address',
  pure: true,
})
export class AddressPipe implements PipeTransform {
  transform(value: Consignee): string {
    const name = value.name ?? 'N/A';
    const countryCode = !value.countryCode || value.countryCode === '' ? 'N/A' : value.countryCode;
    return `${value.parma} - ${name} - ${countryCode}`;
  }
}
