import { Component, forwardRef, Injector } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectUserTimeFormat } from '../../../state';

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
export class TimepickerComponent extends CustomInputAbstract {
  timeFormat$ = this.store.select(selectUserTimeFormat);

  constructor(injector: Injector, private store: Store) {
    super(injector);
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }
}
