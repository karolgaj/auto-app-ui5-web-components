import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { Tbr } from '../../../../models/tbr.model';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { CommonValidators } from '../../../../utils/validators';

type TransportType = 'PARTIAL_EXPRESS' | 'EXPRESS';
interface TransportTypeForm {
  crossDock: string;
  mustArriveDate: string;
  mustArriveTime: string;
  mustArriveTimeZone: string;
  openingHourAtDelivery: string;
  closeHourAtDelivery: string;
  transportSelection: TransportType;
  expressType: 'NORMAL';
}

@UntilDestroy()
@Component({
  selector: 'app-wizard-step-transport-type',
  templateUrl: './wizard-step-transport-type.component.html',
})
export class WizardStepTransportTypeComponent extends WizardStepAbstract implements OnInit {
  @ViewChild('partialExpressType')
  partialExpressType!: ElementRef;

  @ViewChild('expressType')
  expressType!: ElementRef;

  form!: IFormGroup<TransportTypeForm>;
  isCrossDock$!: Observable<boolean | null>;
  expressTypeStatus$!: Observable<string>;
  partialExpressTypeStatus$!: Observable<string>;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.watchForm();
  }

  selectType(type: TransportType) {
    this.form.reset({
      closeHourAtDelivery: '',
      crossDock: '',
      expressType: 'NORMAL',
      mustArriveDate: '',
      mustArriveTime: '',
      mustArriveTimeZone: '',
      openingHourAtDelivery: '',
      transportSelection: type,
    });
  }

  getData(): Partial<Tbr> {
    return {};
  }

  protected createForm(): void {
    this.form = this.fb.group<TransportTypeForm>(
      {
        transportSelection: [null],
        expressType: 'NORMAL',
        crossDock: [null],
        mustArriveDate: [null],
        mustArriveTime: [null],
        mustArriveTimeZone: [null],
        openingHourAtDelivery: [null],
        closeHourAtDelivery: [null],
      },
      {
        validators: [
          CommonValidators.IsHourInBetweenHours<TransportTypeForm>('mustArriveTime', 'openingHourAtDelivery', 'closeHourAtDelivery'),
          CommonValidators.IsDateAfterDate<TransportTypeForm>('mustArriveDate', undefined, this.data?.deliveryDate),
          CommonValidators.IsHourBeforeHour<TransportTypeForm>('openingHourAtDelivery', 'closeHourAtDelivery'),
        ],
      }
    );
  }

  protected patchInitialForm(): void {}

  private watchForm(): void {
    this.isCrossDock$ = this.form.controls.transportSelection.valueChanges.pipe(
      map((value) => {
        if (value) {
          return value === 'PARTIAL_EXPRESS';
        }
        return null;
      }),
      untilDestroyed(this)
    );

    this.expressTypeStatus$ = this.isCrossDock$.pipe(
      map((value) => {
        if (value == null) {
          return '';
        }
        return value ? '' : 'Selected';
      })
    );

    this.partialExpressTypeStatus$ = this.isCrossDock$.pipe(
      map((value) => {
        if (value == null) {
          return '';
        }
        return value ? 'Selected' : '';
      })
    );
  }
}
