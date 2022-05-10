import { Component } from '@angular/core';
import { CommonValidators } from './utils/validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(validators: CommonValidators) {
    validators.init();
  }
}
