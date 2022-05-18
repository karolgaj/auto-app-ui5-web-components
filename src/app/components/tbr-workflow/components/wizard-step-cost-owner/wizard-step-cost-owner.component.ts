import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { IFormGroup } from '@rxweb/types';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Tbr } from '../../../../models/tbr.model';

interface CostOwnerForm {
  consignee: string;
  consignor: string;
  costOwner: CostOwnerValues;
  costPercentageForConsignee: number;
  costPercentageForConsignor: number;
}
type CostOwnerValues = 'VOLVO' | 'EXTERNAL' | 'SHARED_COST' | 'NOT_AGREED';
type CostOwnerSelectionOptions = 'CONSIGNEE' | 'CONSIGNOR' | 'SHARED' | 'NOT_AGREED';

@UntilDestroy()
@Component({
  selector: 'app-wizard-step-cost-owner',
  templateUrl: './wizard-step-cost-owner.component.html',
})
export class WizardStepCostOwnerComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  form!: IFormGroup<CostOwnerForm>;
  consignor = 'Akwel Sweden AB';

  @ViewChild('consignorSlider')
  consignorSlider!: ElementRef;

  @ViewChild('consigneeSlider')
  consigneeSlider!: ElementRef;
  consigneeCost = 50;
  consignorCost = 50;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngAfterViewInit() {
    fromEvent(this.consigneeSlider.nativeElement, 'input')
      .pipe(
        map((event) => (event as any).target._stateStorage.value),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.consigneeCost = value;
        this.consignorCost = 100 - value;
        this.form.controls.costPercentageForConsignee.setValue(this.consigneeCost);
        this.form.controls.costPercentageForConsignee.setValue(this.consignorCost);
      });

    fromEvent(this.consignorSlider.nativeElement, 'input')
      .pipe(
        map((event) => (event as any).target._stateStorage.value),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.consignorCost = value;
        this.consigneeCost = 100 - value;
        this.form.controls.costPercentageForConsignor.setValue(this.consignorCost);
        this.form.controls.costPercentageForConsignee.setValue(this.consigneeCost);
      });
  }

  selectCostOwner(costOwnerSelection: CostOwnerSelectionOptions) {
    let data: Partial<CostOwnerForm>;

    switch (costOwnerSelection) {
      case 'CONSIGNEE':
        data = {
          costOwner: 'VOLVO',
          costPercentageForConsignee: 100,
          costPercentageForConsignor: 0,
        };
        break;
      case 'CONSIGNOR':
        data = {
          costOwner: 'VOLVO',
          costPercentageForConsignee: 0,
          costPercentageForConsignor: 100,
        };
        break;
      case 'SHARED':
        data = {
          costOwner: 'SHARED_COST',
          costPercentageForConsignee: 50,
          costPercentageForConsignor: 50,
        };
        break;
      case 'NOT_AGREED':
        data = {
          costOwner: 'NOT_AGREED',
          costPercentageForConsignee: 100,
          costPercentageForConsignor: 0,
        };
        break;
      default:
        const exhaustCheck: never = costOwnerSelection;
        throw Error(`Not supported cost owner selection value: ${costOwnerSelection}`);
    }

    this.consigneeCost = data.costPercentageForConsignee as number;
    this.consignorCost = data.costPercentageForConsignor as number;
    this.form.patchValue(data);
  }

  getData(): Partial<Tbr> {
    return {
      approvalDecision: {
        costOwner: this.form.controls.costOwner.value,
        costPercentageForConsignee: this.form.controls.costPercentageForConsignee.value,
        costPercentageForConsignor: this.form.controls.costPercentageForConsignor.value,
      },
    };
  }

  protected createForm(): void {
    this.form = this.fb.group<CostOwnerForm>({
      consignee: [null],
      consignor: [null],
      costOwner: [null, Validators.required],
      costPercentageForConsignee: 50,
      costPercentageForConsignor: 50,
    });
  }

  protected patchInitialForm(): void {
    let data: Partial<CostOwnerForm> = {
      consignee: this.data.consignee.name,
      consignor: this.data.consignor.name,
    };

    if (this.data.approvalDecision) {
      data = {
        ...data,
        ...this.data.approvalDecision,
      };
      this.consigneeCost = this.data.approvalDecision.costPercentageForConsignee;
      this.consignorCost = this.data.approvalDecision.costPercentageForConsignor;
    }
    this.form.patchValue(data);

    this.form.controls.consignor.disable();
    this.form.controls.consignee.disable();
  }
}
