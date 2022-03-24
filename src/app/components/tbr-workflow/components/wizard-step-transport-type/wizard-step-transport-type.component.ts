import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-transport-type',
  templateUrl: './wizard-step-transport-type.component.html',
  styleUrls: ['./wizard-step-transport-type.component.scss'],
})
export class WizardStepTransportTypeComponent extends WizardStepAbstract implements OnInit {
  transportTypeForm = new FormGroup({});
  selectedType?: string;

  constructor() {
    super();
  }

  isValid(): boolean {
    return true;
  }

  selectType(type: string) {
    this.selectedType = type;
  }
}
