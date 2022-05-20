import { HttpClient } from '@angular/common/http';
import { ValidatorFn } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectUserDateFormat, selectUserTimeFormat } from '../state';
import { GOOGLE_API_KEY, GOOGLE_API_URL } from '../core/providers/value-tokens';

const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'yyyyMMdd';

@Injectable({
  providedIn: 'root',
})
export class CommonValidators {
  static timeFormat = TIME_FORMAT;
  static dateFormat = DATE_FORMAT;

  timeFormat$ = this.store.select(selectUserTimeFormat);
  dateFormat$ = this.store.select(selectUserDateFormat);

  constructor(
    @Inject(GOOGLE_API_KEY) private googleApiKey: string,
    @Inject(GOOGLE_API_URL) private googleApiUrl: string,
    private store: Store,
    private http: HttpClient
  ) {}

  validateAddressWithGoogle(value: any) {
    const address = value.street1
      .concat(',+', value.postalCode, ',+', value.city, ',+', value.country)
      .split('')
      .map((char: string) => (char === ' ' ? '+' : char))
      .join('');

    return this.http.get(`${this.googleApiUrl}/geocode/json?address=${address}&key=${this.googleApiKey}`).pipe(
      map((result: any) => (result.results[0] !== null || result.results[0].geometry.location ? result.results[0] : null)),
      switchMap((result: any) => {
        const { lat, lng } = result.geometry.location;
        let timestamp = Date.now();
        const len = timestamp.toString().length;

        if (len > 12) {
          timestamp = Number(timestamp.toString().substr(0, 12));
        }
        return this.http
          .get(`${this.googleApiUrl}/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${this.googleApiKey}`)
          .pipe(
            map((value) => ({
              ...value,
              location: result,
            }))
          );
      })
    );
  }

  init(): void {
    this.timeFormat$.subscribe((value) => {
      if (value == null) {
        return;
      }
      CommonValidators.timeFormat = value;
    });

    this.dateFormat$.subscribe((value) => {
      if (value == null) {
        return;
      }
      CommonValidators.dateFormat = value;
    });
  }

  static IsPastDate(value: string): boolean {
    if (value == null) {
      return false;
    }

    const format = value.length === 8 ? DATE_FORMAT : CommonValidators.dateFormat;
    return DateTime.now().startOf('day') > DateTime.fromFormat(value, format).startOf('day');
  }

  static IsNotPastDate(value: string): boolean {
    return !CommonValidators.IsPastDate(value);
  }

  static IsNotPastDateValidator(): ValidatorFn {
    return (control) => {
      return CommonValidators.IsPastDate(control.value)
        ? {
            isPastDate: true,
          }
        : null;
    };
  }

  static IsHourInBetweenHours<T extends GenericWithStrings<T>>(checkDateKey: keyof T, betweenFromKey: keyof T, betweenToKey: keyof T) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', this.timeFormat);
      const betweenFrom = DateTime.fromFormat((control.controls[betweenFromKey].value as string) ?? '', this.timeFormat);
      const betweenTo = DateTime.fromFormat((control.controls[betweenToKey].value as string) ?? '', this.timeFormat);

      if (betweenFrom <= checkDate && checkDate <= betweenTo) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isBetweenTimes: {
          betweenTo,
          betweenFrom,
        },
      });
    };
  }

  static IsHourBeforeHour<T extends GenericWithStrings<T>>(checkDateKey: keyof T, beforeDateKey: keyof T) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', this.timeFormat);
      const afterDate = DateTime.fromFormat((control.controls[beforeDateKey].value as string) ?? '', this.timeFormat);

      if (checkDate < afterDate) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isHourAfterHour: afterDate,
      });
    };
  }

  static IsDateAfterDate<T extends GenericWithStrings<T>>(checkDateKey: keyof T, afterDateKey?: keyof T, afterDateValue?: string) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', this.dateFormat);
      let afterDate;

      if (afterDateKey) {
        afterDate = DateTime.fromFormat((control.controls[afterDateKey].value as string) ?? '', this.dateFormat);
      } else if (afterDateValue) {
        afterDate = DateTime.fromFormat(afterDateValue, this.dateFormat);
      }

      if (afterDate == null) {
        return;
      }

      if (checkDate >= afterDate) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isDateAfterDate: afterDate,
      });
    };
  }
}

type GenericWithStrings<T> = {
  [k in keyof T]: string;
};
