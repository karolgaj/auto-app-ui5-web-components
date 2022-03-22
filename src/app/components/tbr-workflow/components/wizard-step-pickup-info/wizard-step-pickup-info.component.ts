import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-pickup-info',
  templateUrl: './wizard-step-pickup-info.component.html',
  styleUrls: ['./wizard-step-pickup-info.component.scss'],
})
export class WizardStepPickupInfoComponent extends WizardStepAbstract implements OnInit {
  private form!: FormGroup;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  isValid(): boolean {
    return true;
  }
}
