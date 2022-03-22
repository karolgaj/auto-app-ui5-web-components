import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-cost-owner',
  templateUrl: './wizard-step-cost-owner.component.html',
  styleUrls: ['./wizard-step-cost-owner.component.scss'],
})
export class WizardStepCostOwnerComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}
  isValid(): boolean {
    return true;
  }
}
