import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-contact',
  templateUrl: './wizard-step-contact.component.html',
  styleUrls: ['./wizard-step-contact.component.scss'],
})
export class WizardStepContactComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  isValid(): boolean {
    return true;
  }
}
