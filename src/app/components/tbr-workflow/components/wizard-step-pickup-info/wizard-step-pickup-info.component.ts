import { Component, Input, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder, Validators } from '@angular/forms';
import { Tbr } from '../../../../models/tbr.model';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

interface PickupInfoForm {
  pickupDate: string;
  pickupTime: string;
  openingHour: string;
  closingHour: string;
  reference: string;
  msgToCarrier: string;
}

@Component({
  selector: 'app-wizard-step-pickup-info',
  templateUrl: './wizard-step-pickup-info.component.html',
  styleUrls: ['./wizard-step-pickup-info.component.scss'],
})
export class WizardStepPickupInfoComponent extends WizardStepAbstract implements OnInit {
  @Input()
  tbrDetails!: Tbr;

  pickupInfoForm!: IFormGroup<PickupInfoForm>;

  private fb: IFormBuilder;

  constructor(fb: FormBuilder) {
    super();
    this.fb = fb;
    this.createForm();
  }

  isValid(): boolean {
    return true;
  }

  private createForm() {
    this.pickupInfoForm = this.fb.group<PickupInfoForm>({
      closingHour: [null, [Validators.required]],
      openingHour: [null, [Validators.required]],
      pickupTime: [null, [Validators.required]],
      pickupDate: null,
      reference: null,
      msgToCarrier: null,
    });
  }
}
