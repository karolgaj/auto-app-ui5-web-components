import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { selectedTbr } from '../../state/tbr.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-tbr-workflow',
  templateUrl: './tbr-workflow.component.html',
  styleUrls: ['./tbr-workflow.component.scss'],
})
export class TbrWorkflowComponent implements OnInit, AfterViewInit {
  @ViewChild('wizard')
  wizard!: ElementRef;

  activeStep = 0;

  details = this.store.select(selectedTbr);

  constructor(private store: Store) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    console.log();
  }

  goToStep(index: number) {
    const steps: any[] = Array.from(this.wizard.nativeElement.children as HTMLCollection);
    this.activeStep = index;
    steps.forEach((step, index) => {
      step.selected = this.activeStep === index;
    });
    steps[this.activeStep].disabled = false;
  }

  finalize() {}

  stepChange($event: any) {
    this.activeStep = Array.from(this.wizard.nativeElement.children as HTMLCollection).findIndex((step: any) => step.selected);
  }

  goBack() {}
}
