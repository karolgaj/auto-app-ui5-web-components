import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { WizardStepAbstract } from './components/wizard-step-abstract';
import { selectedTbr, updateSelectedTbr } from '../../state';

@Component({
  selector: 'app-tbr-workflow',
  templateUrl: './tbr-workflow.component.html',
})
export class TbrWorkflowComponent {
  @ViewChild('wizard')
  wizard!: ElementRef;

  @ViewChildren('wizardStep')
  wizardSteps!: QueryList<WizardStepAbstract>;

  activeStep = 0;

  details$ = this.store.select(selectedTbr);

  constructor(private store: Store) {}

  goToStep(index: number) {
    const steps: any[] = Array.from(this.wizard.nativeElement.children as HTMLCollection);

    const currentStepData = this.wizardSteps.get(this.activeStep)?.getData();
    if (currentStepData) {
      this.store.dispatch(updateSelectedTbr({ data: currentStepData }));
    }

    this.activeStep = index;
    steps.forEach((step, index) => {
      step.selected = this.activeStep === index;
    });
    steps[this.activeStep].disabled = false;
  }

  finalize(): void {
    // this.details$.pipe(take(1)).subscribe((details) => {
    //   let payload = {
    //     ...details,
    //   };
    //
    //   this.wizardSteps.forEach((step) => {
    //     const newData = step.getData();
    //     payload = {
    //       ...payload,
    //       ...newData,
    //     };
    //   });
    //
    //   // this.store.dispatch();
    // });
  }

  stepChange($event: any) {
    this.activeStep = Array.from(this.wizard.nativeElement.children as HTMLCollection).findIndex((step: any) => step.selected);
  }

  goBack() {}
}
