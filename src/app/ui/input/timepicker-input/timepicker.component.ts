import { Component, forwardRef } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
  constructor() {
    super();
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }
}
