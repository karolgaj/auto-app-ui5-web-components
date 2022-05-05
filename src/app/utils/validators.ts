import { DateTime } from 'luxon';
import { ValidatorFn } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';

const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'HH:mm';

export class CommonValidators {
  static IsPastDate(value: string, format = 'yyyyMMdd'): boolean {
    return DateTime.now().startOf('day') > DateTime.fromFormat(value, format).startOf('day');
  }

  static IsNotPastDate(value: string, format = 'yyyyMMdd'): boolean {
    return !CommonValidators.IsPastDate(value, format);
  }

  static IsNotPastDateValidator(): ValidatorFn {
    return (control) =>
      CommonValidators.IsNotPastDate(control.value)
        ? null
        : {
            isPastDate: true,
          };
  }

  static IsHourInBetweenHours<T extends GenericWithStrings<T>>(checkDateKey: keyof T, betweenFromKey: keyof T, betweenToKey: keyof T) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', TIME_FORMAT);
      const betweenFrom = DateTime.fromFormat((control.controls[betweenFromKey].value as string) ?? '', TIME_FORMAT);
      const betweenTo = DateTime.fromFormat((control.controls[betweenToKey].value as string) ?? '', TIME_FORMAT);

      if (betweenFrom <= checkDate && checkDate <= betweenTo) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isBetweenTimes: true,
      });
    };
  }

  static IsHourBeforeHour<T extends GenericWithStrings<T>>(checkDateKey: keyof T, beforeDateKey: keyof T) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', TIME_FORMAT);
      const afterDate = DateTime.fromFormat((control.controls[beforeDateKey].value as string) ?? '', TIME_FORMAT);

      if (checkDate < afterDate) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isHourAfterHour: true,
      });
    };
  }

  static IsDateAfterDate<T extends GenericWithStrings<T>>(checkDateKey: keyof T, afterDateKey?: keyof T, afterDateValue?: string) {
    return (control: IFormGroup<T>) => {
      const checkDate = DateTime.fromFormat((control.controls[checkDateKey].value as string) ?? '', DATE_FORMAT);
      let afterDate;

      if (afterDateKey) {
        afterDate = DateTime.fromFormat((control.controls[afterDateKey].value as string) ?? '', DATE_FORMAT);
      } else if (afterDateValue) {
        afterDate = DateTime.fromFormat(afterDateValue, DATE_FORMAT);
      }

      if (afterDate == null) {
        return;
      }

      if (checkDate >= afterDate) {
        return;
      }

      control.controls[checkDateKey].setErrors({
        isDateAfterDate: true,
      });
    };
  }
}

type GenericWithStrings<T> = {
  [k in keyof T]: string;
};
