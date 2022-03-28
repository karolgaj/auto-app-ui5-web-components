import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Store } from '@ngrx/store';
import { selectCauses } from '../../../../state/tbr.selectors';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFormArray, IFormBuilder } from '@rxweb/types';
import { loadReasonCodes } from '../../../../state/tbr.actions';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { Observable, of } from 'rxjs';
import { SecondSubCode, SubCode } from '../../../../models/reason-code.model';

interface ReasonCodeData {
  cause: string;
  reasonCode: string;
  reasonSubcode: string;
  reference: string;
}

@Component({
  selector: 'app-wizard-step-reason-code',
  templateUrl: './wizard-step-reason-code.component.html',
  styleUrls: ['./wizard-step-reason-code.component.scss'],
})
export class WizardStepReasonCodeComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  @ViewChild('reasonCodeDialog')
  reasonCodeDialog!: DialogComponent;

  @ViewChild('subCodeDialog')
  subCodeDialog!: DialogComponent;

  @ViewChild('secondSubCodeDialog')
  secondSubCodeDialog!: DialogComponent;

  private fb: IFormBuilder;

  reasonCodes$ = this.store.select(selectCauses());
  subCodes$: Observable<SubCode[]> = of([]);
  secondSubCodes$: Observable<SecondSubCode[]> = of([]);

  reasonCodesFormArray!: IFormArray<ReasonCodeData>;

  openReasonCodesDialog!: () => void;
  openSecondSubCodesDialog!: () => void;
  openSubCodesDialog!: () => void;

  private editingIndex?: number;

  constructor(private store: Store, fb: FormBuilder) {
    super();
    this.store.dispatch(loadReasonCodes());
    this.fb = fb;
    this.createForm();
  }

  ngAfterViewInit() {
    this.openReasonCodesDialog = () => {
      this.openDialog.call(this, this.reasonCodeDialog);
    };

    this.openSecondSubCodesDialog = this.openDialog.bind(this, this.subCodeDialog);

    this.openSubCodesDialog = this.openDialog.bind(this, this.secondSubCodeDialog);
  }

  createForm(): void {
    this.reasonCodesFormArray = this.fb.array<ReasonCodeData>([]);
  }

  isValid(): boolean {
    return true;
  }

  addReasonCode(): void {
    this.reasonCodesFormArray.push(
      this.fb.group<ReasonCodeData>({
        cause: [null],
        reasonCode: [null],
        reasonSubcode: [null],
        reference: [null],
      })
    );
  }

  getFormGroup(rowForm: any): FormGroup {
    return rowForm as FormGroup;
  }

  closeReasonCodesDialog() {
    this.reasonCodeDialog.closeDialog();
  }

  closeSubCodesDialog() {
    this.subCodeDialog.closeDialog();
  }

  closeSecondSubCodesDialog() {
    this.secondSubCodeDialog.closeDialog();
  }

  private openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  chooseReasonCode(cause: string) {
    if (this.editingIndex) {
      this.reasonCodesFormArray.at(this.editingIndex).get('cause')?.setValue(cause);
    }
    this.closeReasonCodesDialog();
  }

  chooseSubCode(subCode: SubCode) {
    if (this.editingIndex) {
      this.reasonCodesFormArray.at(this.editingIndex).get('subCode')?.setValue(subCode.code);
    }
    this.closeSubCodesDialog();
  }

  chooseSecondSubCode(secondSubCode: SecondSubCode) {
    if (this.editingIndex) {
      this.reasonCodesFormArray.at(this.editingIndex).get('subCode')?.setValue(secondSubCode.code);
    }
    this.closeSubCodesDialog();
  }
}
