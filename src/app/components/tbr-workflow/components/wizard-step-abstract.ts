import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { Tbr } from '../../../models/tbr.model';

@Directive()
export abstract class WizardStepAbstract implements OnInit {
  @Input()
  titleText!: string;

  @Input()
  stepIndex!: number;

  @Input()
  data!: Tbr;

  @Output()
  nextStep = new EventEmitter<number>();

  title = '';
  nextStepIndex = 0;
  protected fb: IFormBuilder;

  protected constructor(fb: FormBuilder) {
    this.fb = fb;
    this.createForm();
  }

  abstract form: IFormGroup<any> | IFormArray<any>;
  abstract getData(): Partial<Tbr>;

  protected abstract createForm(): void;
  protected abstract patchInitialForm(): void;

  ngOnInit(): void {
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
