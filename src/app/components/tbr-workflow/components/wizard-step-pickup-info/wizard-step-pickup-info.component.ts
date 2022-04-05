import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder, Validators } from '@angular/forms';
import { Tbr } from '../../../../models/tbr.model';
import { IFormGroup } from '@rxweb/types';
import { CommonValidators } from '../../../../utils/validators';

interface PickupInfoForm {
  deliveryDate: string;
  collectionTime: string;
  openingHourAtCollection: string;
  closingHourAtCollection: string;
  pickupReference: string;
  messageToCarrier: string;
}

@Component({
  selector: 'app-wizard-step-pickup-info',
  templateUrl: './wizard-step-pickup-info.component.html',
})
export class WizardStepPickupInfoComponent extends WizardStepAbstract implements OnInit {
  form!: IFormGroup<PickupInfoForm>;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.patchInitialForm();
  }

  getData(): Partial<Tbr> {
    const payload = this.form.getRawValue();
    return {
      approvalDecision: {
        collectionTime: payload.collectionTime,
        openingHourAtCollection: payload.openingHourAtCollection,
        closingHourAtCollection: payload.closingHourAtCollection,
      },
      pickupReference: payload.pickupReference,
      messageToCarrier: payload.messageToCarrier,
    };
  }

  protected createForm(): void {
    this.form = this.fb.group<PickupInfoForm>(
      {
        deliveryDate: null,
        closingHourAtCollection: [null, [Validators.required]],
        openingHourAtCollection: [null, [Validators.required]],
        collectionTime: [null, [Validators.required]],
        pickupReference: [null, [Validators.maxLength(70)]],
        messageToCarrier: [null, [Validators.maxLength(70)]],
      },
      {
        validators: [
          CommonValidators.IsHourInBetweenHours<PickupInfoForm>('deliveryDate', 'openingHourAtCollection', 'closingHourAtCollection'),
          CommonValidators.IsHourBeforeHour<PickupInfoForm>('openingHourAtCollection', 'closingHourAtCollection'),
        ],
      }
    );
    this.form.controls.deliveryDate.disable();
  }

  protected patchInitialForm(): void {
    const data = {
      approvalDecision: {
        collectionTime: this.data.approvalDecision?.collectionTime,
        openingHourAtCollection: this.data.approvalDecision?.openingHourAtCollection,
        closingHourAtCollection: this.data.approvalDecision?.closingHourAtCollection,
      },
      pickupReference: this.data.pickupReference,
      messageToCarrier: this.data.messageToCarrier,
      deliveryDate: this.data.deliveryDate,
    };
    this.form.patchValue(data);
  }
}
