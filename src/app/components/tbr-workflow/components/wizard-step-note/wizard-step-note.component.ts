import { Component, OnInit } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import { FormBuilder } from '@angular/forms';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Tbr } from '../../../../models/tbr.model';

@Component({
  selector: 'app-wizard-step-note',
  templateUrl: './wizard-step-note.component.html',
})
export class WizardStepNoteComponent extends WizardStepAbstract implements OnInit {
  form!: IFormGroup<any>;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  getData(): Partial<Tbr> {
    return this.form.getRawValue();
  }

  protected createForm(): void {
    this.form = this.fb.group({
      internalNote: null,
    });
  }

  protected patchInitialForm(): void {}
}
