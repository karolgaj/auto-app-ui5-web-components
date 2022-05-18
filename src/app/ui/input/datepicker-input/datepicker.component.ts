import { AfterViewInit, Component, forwardRef, Injector, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DateTime } from 'luxon';
import { filter, take } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { CustomInputAbstract } from '../custom-input.abstract';
import { selectUserDateFormat } from '../../../state';

@UntilDestroy()
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatepickerComponent),
    },
  ],
})
export class DatepickerComponent extends CustomInputAbstract implements OnInit, AfterViewInit {
  dateFormat$ = this.store.select(selectUserDateFormat);
  dateFormat = 'yyyyMMdd';

  constructor(injector: Injector, private store: Store) {
    super(injector);
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: any) => {
      const date =
        e.detail.value?.length === 8 ? e.detail.value : DateTime.fromFormat(e.detail.value, this.dateFormat).toFormat('yyyyMMdd');
      if (date.includes('Invalid')) {
        return;
      }
      this.writeValue(date);
      this.onChange(this.value);
      this.markAsTouched();
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dateFormat$.pipe(filter(Boolean), take(1)).subscribe((format) => {
      this.dateFormat = format;
    });

    this.formControl.valueChanges.subscribe((value) => {
      if (value && value.length === 8) {
        this.writeValue(value);
      }
    });
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }

  formatValue = (value: string): string => {
    if (value && value.length === 8) {
      return DateTime.fromFormat(value, 'yyyyMMdd').toFormat(this.dateFormat);
    }
    return value;
  };
}
