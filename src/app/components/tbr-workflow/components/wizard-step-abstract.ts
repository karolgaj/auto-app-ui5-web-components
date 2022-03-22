import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive()
export abstract class WizardStepAbstract {
  @Output()
  nextStep = new EventEmitter<number>();

  @Input()
  title!: string;

  @Input()
  stepIndex!: number;

  abstract isValid(): boolean;

  goToNextStep(): void {
    if (this.isValid()) {
      this.nextStep.next(this.stepIndex + 1);
    }
  }
}
