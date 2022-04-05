import { Component } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    console.log(DateTime.fromString('asdasdasd', 'ddMMyyyy'));
  }
}
