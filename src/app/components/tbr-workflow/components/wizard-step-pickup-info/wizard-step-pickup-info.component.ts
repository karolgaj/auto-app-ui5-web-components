import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Tbr } from '../../../../models/tbr.model';
import { CommonValidators } from '../../../../utils/validators';

interface PickupInfoForm {
  deliveryDate: string;
  collectionTime: string;
  openingHourAtCollection: string;
  closeHourAtCollection: string;
  pickupReference: string;
  messageToCarrier: string;
}

@Component({
  selector: 'app-wizard-step-pickup-info',
  templateUrl: './wizard-step-pickup-info.component.html',
})
export class WizardStepPickupInfoComponent extends WizardStepAbstract {
  form!: IFormGroup<PickupInfoForm>;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  getData(): Partial<Tbr> {
    const payload = this.form.getRawValue();
    return {
      approvalDecision: {
        collectionTime: payload.collectionTime,
        openingHourAtCollection: payload.openingHourAtCollection,
        closingHourAtCollection: payload.closeHourAtCollection,
      },
      pickupReference: payload.pickupReference,
      messageToCarrier: payload.messageToCarrier,
    };
  }

  protected createForm(): void {
    this.form = this.fb.group<PickupInfoForm>(
      {
        deliveryDate: null,
        closeHourAtCollection: [null, [Validators.required]],
        openingHourAtCollection: [null, [Validators.required]],
        collectionTime: [null, [Validators.required]],
        pickupReference: [null, [Validators.maxLength(70)]],
        messageToCarrier: [null, [Validators.maxLength(70)]],
      },
      {
        validators: [
          CommonValidators.IsHourInBetweenHours<PickupInfoForm>('deliveryDate', 'openingHourAtCollection', 'closeHourAtCollection'),
          CommonValidators.IsHourBeforeHour<PickupInfoForm>('openingHourAtCollection', 'closeHourAtCollection'),
        ],
      }
    );
    this.form.controls.deliveryDate.disable();
  }

  protected patchInitialForm(): void {
    const data = {
      collectionTime: this.data.approvalDecision?.collectionTime,
      openingHourAtCollection: this.data.approvalDecision?.openingHourAtCollection,
      closeHourAtCollection: this.data.approvalDecision?.closeHourAtCollection,
      pickupReference: this.data.pickupReference,
      messageToCarrier: this.data.messageToCarrier,
      deliveryDate: this.data.deliveryDate,
    };
    this.form.patchValue(data);
  }
}
