import { Component, Input } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent extends CustomInputAbstract {
  @Input()
  showColon = false;

  constructor() {
    super();
  }

  getId(): string {
    return `custom-datepicker-${this._id}`;
  }
}
