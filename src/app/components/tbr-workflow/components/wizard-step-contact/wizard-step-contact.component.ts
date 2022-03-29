import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-wizard-step-contact',
  templateUrl: './wizard-step-contact.component.html',
  styleUrls: ['./wizard-step-contact.component.scss'],
})
export class WizardStepContactComponent extends WizardStepAbstract implements OnInit {
  contactForm!: IFormGroup<ContactForm>;

  private fb: IFormBuilder;

  constructor(fb: FormBuilder) {
    super();
    this.fb = fb;
    this.createForm();
  }

  isValid(): boolean {
    return true;
  }

  private createForm(): void {
    this.contactForm = this.fb.group<ContactForm>({
      email: this.fb.control(null, [Validators.required]),
      name: this.fb.control(null, [Validators.required]),
      phone: this.fb.control(null, [Validators.required]),
    });
  }
}
