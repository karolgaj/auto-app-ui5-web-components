import { Pipe, PipeTransform } from '@angular/core';
import { Consignee } from '../models/tbr.model';

@Pipe({
  name: 'address',
  pure: true,
})
export class AddressPipe implements PipeTransform {
  transform(value: Consignee, withCountryCode = true): string {
    const name = value.name ?? 'N/A';
    let address = `${value.parma} - ${name}`;

    if (withCountryCode) {
      const countryCode = !value.countryCode || value.countryCode === '' ? 'N/A' : value.countryCode;
      address = `${address} - ${countryCode}`;
    }

    return address;
  }
}
