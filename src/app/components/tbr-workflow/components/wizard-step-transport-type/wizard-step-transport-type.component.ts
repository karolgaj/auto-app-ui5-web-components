import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

interface TransportTypeForm {
  xdock: string;
  mustArriveDate: string;
  mustArriveTime: string;
  openingHour: string;
  closingHour: string;
}

@Component({
  selector: 'app-wizard-step-transport-type',
  templateUrl: './wizard-step-transport-type.component.html',
  styleUrls: ['./wizard-step-transport-type.component.scss'],
})
export class WizardStepTransportTypeComponent extends WizardStepAbstract implements OnInit {
  transportTypeForm!: IFormGroup<TransportTypeForm>;
  selectedType?: string;

  private fb: IFormBuilder;

  constructor(fb: FormBuilder) {
    super();
    this.fb = fb;
    this.createForm();
  }

  isValid(): boolean {
    return true;
  }

  selectType(type: string) {
    this.selectedType = type;
  }

  private createForm(): void {
    this.transportTypeForm = this.fb.group<TransportTypeForm>({
      xdock: [null],
      closingHour: [null],
      mustArriveDate: [null],
      mustArriveTime: [null],
      openingHour: [null],
    });
  }
}
