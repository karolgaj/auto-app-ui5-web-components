import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-reason-code',
  templateUrl: './wizard-step-reason-code.component.html',
  styleUrls: ['./wizard-step-reason-code.component.scss'],
})
export class WizardStepReasonCodeComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  isValid(): boolean {
    return true;
  }
}
