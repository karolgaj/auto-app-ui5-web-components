import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDate',
  pure: true,
})
export class ParseDatePipe implements PipeTransform {
  transform(value: string): string {
    return ParseDatePipe.formatDate(ParseDatePipe.parseDateNew(value));
  }

  private static parseDateNew(dateString: string): Date | string {
    if (dateString?.length === 8) {
      const year = parseInt(dateString.slice(0, 4), 10);
      const month = parseInt(dateString.slice(4, 6), 10) - 1;
      const date = parseInt(dateString.slice(6, 8), 10);
      return new Date(year, month, date);
    }

    return '';
  }

  private static formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return date?.toLocaleDateString();
  }
}
