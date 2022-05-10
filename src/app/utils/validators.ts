import { ValidatorFn } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { DateTime } from 'luxon';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserDateFormat, selectUserTimeFormat } from '../state';

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

  constructor(private store: Store) {}

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
