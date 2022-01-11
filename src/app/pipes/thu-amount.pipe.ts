import { Pipe, PipeTransform } from '@angular/core';
import { Tbr } from '../models/tbr.model';

@Pipe({
  name: 'thuAmount',
  pure: true,
})
export class ThuAmountPipe implements PipeTransform {
  transform(value: Tbr): number {
    let amount = 0;
    value.shipUnitLines.forEach((slu) => {
      amount += parseInt(slu.quantity);
    });
    return amount;
  }
}
