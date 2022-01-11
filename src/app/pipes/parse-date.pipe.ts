import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDate',
  pure: true,
})
export class ParseDatePipe implements PipeTransform {
  transform(value: string): string {
    return this.formatDate1(this.parseDateNew(value));
  }

  private parseDateNew(dateString: string): Date {
    if (dateString?.length === 8) {
      const year = parseInt(dateString.slice(0, 4));
      const month = parseInt(dateString.slice(4, 6)) - 1;
      const date = parseInt(dateString.slice(6, 8));
      return new Date(year, month, date);
    } else {
      return new Date(0);
    }
  }

  private formatDate1(date: Date): string {
    return date?.toLocaleDateString();
  }
}
