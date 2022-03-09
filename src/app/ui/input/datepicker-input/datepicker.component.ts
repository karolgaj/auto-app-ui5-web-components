import { AfterViewInit, Component } from '@angular/core';
import { InputComponent } from '../text-input/input.component';

let id = 0;

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent extends InputComponent implements AfterViewInit {
  get id(): string {
    return `custom-datepicker-${id}`;
  }

  constructor() {
    super();
  }
}
