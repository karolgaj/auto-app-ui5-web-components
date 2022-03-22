import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-transport-type',
  templateUrl: './wizard-step-transport-type.component.html',
  styleUrls: ['./wizard-step-transport-type.component.scss'],
})
export class WizardStepTransportTypeComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  isValid(): boolean {
    return true;
  }
}
