import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive()
export abstract class WizardStepAbstract implements OnInit {
  @Output()
  nextStep = new EventEmitter<number>();

  @Input()
  titleText!: string;

  @Input()
  stepIndex!: number;

  title = '';
  nextStepIndex = 0;

  abstract isValid(): boolean;

  ngOnInit() {
    this.title = `${this.stepIndex + 1}. ${this.titleText}`;
    this.nextStepIndex = this.stepIndex + 2;
  }

  goToNextStep(): void {
    if (this.isValid()) {
      this.nextStep.next(this.stepIndex + 1);
    }
  }
}
