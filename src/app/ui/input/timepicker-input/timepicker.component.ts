import { Component, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateTime } from 'luxon';
import { filter, take } from 'rxjs/operators';
import { CustomInputAbstract } from '../custom-input.abstract';
import { selectUserTimeFormat } from '../../../state';

@UntilDestroy()
@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TimepickerComponent),
    },
  ],
})
export class TimepickerComponent extends CustomInputAbstract implements OnInit {
  timeFormat$ = this.store.select(selectUserTimeFormat);
  timeFormat = 'HH:mm';

  constructor(injector: Injector, private store: Store) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.timeFormat$.pipe(filter(Boolean), take(1)).subscribe((format) => {
      this.timeFormat = format;
    });
    this.formControl.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value && value.length === 8) {
        this.writeValue(value);
      }
    });
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }

  formatValue = (value: string): string => {
    if (value && value.length === 5 && value.includes(':')) {
      return DateTime.fromFormat(value, 'HH:mm').toFormat(this.timeFormat);
    }
    return value;
  };
}
