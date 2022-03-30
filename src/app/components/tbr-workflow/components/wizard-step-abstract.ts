import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { Tbr } from '../../../models/tbr.model';
import { FormBuilder } from '@angular/forms';

@Directive()
export abstract class WizardStepAbstract implements OnInit {
  @Output()
  nextStep = new EventEmitter<number>();

  @Input()
  titleText!: string;

  @Input()
  stepIndex!: number;

  @Input()
  data!: Tbr;

  title = '';
  nextStepIndex = 0;
  protected fb: IFormBuilder;

  abstract form: IFormGroup<any> | IFormArray<any>;
  abstract getData(): Partial<Tbr>;
  protected abstract createForm(): void;
  protected abstract patchInitialForm(): void;

  protected constructor(fb: FormBuilder) {
    this.fb = fb;
    this.createForm();
  }

  ngOnInit() {
    this.title = `${this.stepIndex + 1}. ${this.titleText}`;
    this.nextStepIndex = this.stepIndex + 2;
    this.patchInitialForm();
  }

  isValid(): boolean {
    // return this.form.valid;
    return true;
  }

  goToNextStep(): void {
    if (this.isValid()) {
      this.nextStep.next(this.stepIndex + 1);
      return;
    }
    this.form.markAllAsTouched();
  }
}
