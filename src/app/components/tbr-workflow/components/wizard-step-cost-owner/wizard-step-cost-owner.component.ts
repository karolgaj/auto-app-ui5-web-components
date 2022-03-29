import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map } from 'rxjs/operators';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

interface CostOwnerForm {
  consignee: string;
  consignor: string;
}

@UntilDestroy()
@Component({
  selector: 'app-wizard-step-cost-owner',
  templateUrl: './wizard-step-cost-owner.component.html',
  styleUrls: ['./wizard-step-cost-owner.component.scss'],
})
export class WizardStepCostOwnerComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  costOwnerForm!: IFormGroup<CostOwnerForm>;
  consignor = 'Akwel Sweden AB';

  @ViewChild('consignorSlider')
  consignorSlider!: ElementRef;

  @ViewChild('consigneeSlider')
  consigneeSlider!: ElementRef;

  private fb: IFormBuilder;

  constructor(fb: FormBuilder) {
    super();
    this.fb = fb;
    this.createForm();
  }

  ngAfterViewInit() {
    fromEvent(this.consigneeSlider.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target._stateStorage.value),
        debounceTime(100),
        untilDestroyed(this)
      )
      .subscribe(console.log);
    fromEvent(this.consignorSlider.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target._stateStorage.value),
        debounceTime(100),
        untilDestroyed(this)
      )
      .subscribe(console.log);
  }

  isValid(): boolean {
    return true;
  }

  selectCostOwner(costOwner: string) {}

  consignorCostChanged($event: any) {
    console.log($event.target._stateStorage.value);
  }

  consigneeCostChanged($event: any) {
    console.log($event.target._stateStorage.value);
  }

  private createForm(): void {
    this.costOwnerForm = this.fb.group<CostOwnerForm>({
      consignee: [null],
      consignor: [null],
    });
  }
}
