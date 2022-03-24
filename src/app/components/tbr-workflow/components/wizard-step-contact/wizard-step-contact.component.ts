import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wizard-step-contact',
  templateUrl: './wizard-step-contact.component.html',
  styleUrls: ['./wizard-step-contact.component.scss'],
})
export class WizardStepContactComponent extends WizardStepAbstract implements OnInit {
  contactForm = new FormGroup({});
  constructor() {
    super();
  }

  isValid(): boolean {
    return true;
  }
}
