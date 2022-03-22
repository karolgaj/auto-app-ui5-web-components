import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-additional-contacts',
  templateUrl: './wizard-step-additional-contacts.component.html',
  styleUrls: ['./wizard-step-additional-contacts.component.scss'],
})
export class WizardStepAdditionalContactsComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  isValid(): boolean {
    return true;
  }
}
