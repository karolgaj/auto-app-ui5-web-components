import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Tbr } from '../../../../models/tbr.model';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-wizard-step-contact',
  templateUrl: './wizard-step-contact.component.html',
})
export class WizardStepContactComponent extends WizardStepAbstract implements OnInit {
  form!: IFormGroup<ContactForm>;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  getData(): Partial<Tbr> {
    return {
      approvalDecision: {
        contactAtSupplier: this.form.getRawValue(),
      },
    };
  }

  protected createForm(): void {
    this.form = this.fb.group<ContactForm>({
      name: this.fb.control(null, [Validators.required]),
      phone: this.fb.control(null, [Validators.required, Validators.pattern('^\\+(?:[0-9] ?){6,14}[0-9]$')]),
      email: this.fb.control(null, [Validators.required, Validators.email]),
    });
  }

  protected patchInitialForm(): void {
    this.form.patchValue(this.data.approvalDecision?.contactAtSupplier);
  }
}
