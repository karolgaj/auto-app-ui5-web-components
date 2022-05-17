import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { WizardStepAbstract } from './components/wizard-step-abstract';
import { finishWorkflow, selectedTbr, selectTbr, updateSelectedTbr } from '../../state';

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

    if (this.activeStep === steps.length) {
      this.finalize();
      return;
    }
    steps.forEach((step, i) => {
      step.selected = this.activeStep === i;
    });
    steps[this.activeStep].disabled = false;
  }

  finalize(): void {
    this.store.dispatch(
      finishWorkflow({
        data: {
          shipitStatus: 'APPROVAL_IN_PROCESS',
        },
      })
    );
  }

  stepChange($event: any): void {
    this.activeStep = Array.from(this.wizard.nativeElement.children as HTMLCollection).findIndex((step: any) => step.selected);
  }

  goBack(): void {
    this.store.dispatch(selectTbr({ data: null }));
  }
}
