import { Component, Input, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormGroup } from '@angular/forms';
import { Tbr } from '../../../../models/tbr.model';

@Component({
  selector: 'app-wizard-step-pickup-info',
  templateUrl: './wizard-step-pickup-info.component.html',
  styleUrls: ['./wizard-step-pickup-info.component.scss'],
})
export class WizardStepPickupInfoComponent extends WizardStepAbstract implements OnInit {
  @Input()
  tbrDetails!: Tbr;

  pickupInfoForm: FormGroup = new FormGroup({});

  constructor() {
    super();
  }

  isValid(): boolean {
    return true;
  }
}
