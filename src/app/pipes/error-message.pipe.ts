import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorMessage',
  pure: true,
})
export class ErrorMessagePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: ValidationErrors | null): string | null {
    if (value == null) {
      return null;
    }
    return this.getErrorMessage(value);
  }

  private getErrorMessage(value: ValidationErrors): string {
    const key = Object.keys(value)[0];
    switch (key) {
      case 'required':
        return this.translate.instant('VALIDATORS.REQUIRED');
      case 'email':
        return this.translate.instant('VALIDATORS.EMAIL');
      case 'phone':
        return this.translate.instant('VALIDATORS.PHONE');
      case 'maxlength':
        return this.translate.instant('VALIDATORS.MAXLENGTH');
      case 'minlength':
        return this.translate.instant('VALIDATORS.MINLENGTH');
      case 'max':
        return this.translate.instant('VALIDATORS.MAX');
      case 'min':
        return this.translate.instant('VALIDATORS.MIN');
      case 'isPastDate':
        return this.translate.instant('VALIDATORS.IS_PAST_DATE');
      case 'isBetweenTimes':
        return this.translate.instant('VALIDATORS.IS_BETWEEN_TIMES');
      case 'isHourAfterHour':
        return this.translate.instant('VALIDATORS.IS_HOUR_AFTER_HOUR');
      case 'isDateAfterDate':
        return this.translate.instant('VALIDATORS.IS_DATE_AFTER_DATE');
      case 'invalidDate':
        return this.translate.instant('VALIDATORS.INVALID_DATE');
      case 'parmaNotFound':
        return this.translate.instant('VALIDATORS.PARMA_NOT_FOUND');
      default:
        return this.translate.instant('VALIDATORS.INVALID');
    }
  }
}
