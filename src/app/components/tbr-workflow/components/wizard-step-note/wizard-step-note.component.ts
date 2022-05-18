import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Tbr } from '../../../../models/tbr.model';

@Component({
  selector: 'app-wizard-step-note',
  templateUrl: './wizard-step-note.component.html',
})
export class WizardStepNoteComponent extends WizardStepAbstract implements OnInit {
  form!: FormGroup;
  internalNote = this.fb.control('');

  constructor(fb: FormBuilder) {
    super(fb);
  }

  getData(): Partial<Tbr> {
    return {
      internalNote: this.internalNote.value,
    };
  }

  isValid(): boolean {
    return this.internalNote.valid;
  }

  protected createForm(): void {}

  protected patchInitialForm(): void {
    this.internalNote.patchValue(this.data.internalNote);
  }
}
