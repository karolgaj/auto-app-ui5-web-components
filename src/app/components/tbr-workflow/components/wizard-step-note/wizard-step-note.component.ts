import { Component, OnInit } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-note',
  templateUrl: './wizard-step-note.component.html',
  styleUrls: ['./wizard-step-note.component.scss'],
})
export class WizardStepNoteComponent extends WizardStepAbstract implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {}

  isValid(): boolean {
    return true;
  }
}
