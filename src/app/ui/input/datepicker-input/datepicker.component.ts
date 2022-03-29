import { Component, forwardRef, Injector } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class DatepickerComponent extends CustomInputAbstract {
  constructor(injector: Injector) {
    super(injector);
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }
}
