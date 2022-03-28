import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Store } from '@ngrx/store';
import { selectCauses } from '../../../../state/tbr.selectors';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFormArray, IFormBuilder } from '@rxweb/types';
import { loadReasonCodes } from '../../../../state/tbr.actions';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SecondSubCode, SubCode } from '../../../../models/reason-code.model';
import { filter, map, switchMap, take } from 'rxjs/operators';

interface ReasonCodeData {
  cause: string;
  subCode: string;
  secondSubCode: string;
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
  private editingIndex = new BehaviorSubject<number | null>(null);

  reasonCodes$ = this.store.select(selectCauses());
  subCodes$: Observable<SubCode[] | null | undefined> = this.editingIndex.pipe(
    map((editingIndex) => {
      console.log('editingIndex', editingIndex);
      if (editingIndex == null) {
        return null;
      }
      return this.reasonCodesFormArray.at(editingIndex).get('cause')?.value;
    }),
    switchMap((value) => {
      if (value == null) {
        return of([]);
      }
      return this.reasonCodes$.pipe(
        map((reasonCodes) => {
          return reasonCodes.find((reasonCode) => reasonCode.generalCode === value)?.subCodes;
        })
      );
    })
  );

  secondSubCodes$: Observable<SecondSubCode[] | null | undefined> = this.subCodes$.pipe(
    map((subCodes) => {
      console.log(subCodes);
      const editingIndex = this.editingIndex.value;
      if (editingIndex != null) {
        const subCode = this.reasonCodesFormArray.at(editingIndex).get('subCode')?.value;

        if (subCode) {
          return subCodes?.find((sc) => sc.code === subCode)?.secondSubCodes;
        }
      }

      return [];
    })
  );

  reasonCodesFormArray!: IFormArray<ReasonCodeData>;

  openReasonCodesDialog!: () => void;
  openSecondSubCodesDialog!: () => void;
  openSubCodesDialog!: () => void;

  constructor(private store: Store, fb: FormBuilder) {
    super();
    this.store.dispatch(loadReasonCodes());
    this.fb = fb;
    this.createForm();
  }

  ngAfterViewInit() {
    this.openReasonCodesDialog = WizardStepReasonCodeComponent.openDialog.bind(this, this.reasonCodeDialog);

    this.openSubCodesDialog = () => {
      this.editingIndex
        .pipe(
          filter((value) => value != null),
          take(1)
        )
        .subscribe((editingIndex) => {
          if (editingIndex == null) {
            return;
          }
          WizardStepReasonCodeComponent.openDialog.call(this, this.subCodeDialog);
        });
    };

    this.openSecondSubCodesDialog = () => {
      this.editingIndex
        .pipe(
          filter((value) => value != null),
          take(1)
        )
        .subscribe((editingIndex) => {
          if (editingIndex == null) {
            return;
          }
          WizardStepReasonCodeComponent.openDialog.call(this, this.secondSubCodeDialog);
        });
    };
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
        subCode: [null],
        secondSubCode: [null],
        reference: [null],
      })
    );
  }

  getFormGroup(rowForm: any): FormGroup {
    return rowForm as FormGroup;
  }

  closeReasonCodesDialog() {
    this.clearDataOnCLoseDialog();
    this.reasonCodeDialog.closeDialog();
  }

  closeSubCodesDialog() {
    this.clearDataOnCLoseDialog();
    this.subCodeDialog.closeDialog();
  }

  closeSecondSubCodesDialog() {
    this.clearDataOnCLoseDialog();
    this.secondSubCodeDialog.closeDialog();
  }

  private clearDataOnCLoseDialog(): void {
    this.editingIndex.next(null);
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  chooseReasonCode(cause: number) {
    if (this.editingIndex.value != null) {
      this.reasonCodesFormArray.at(this.editingIndex.value).get('cause')?.setValue(cause);
    }
    this.closeReasonCodesDialog();
  }

  chooseSubCode(subCode: SubCode) {
    if (this.editingIndex.value != null) {
      this.reasonCodesFormArray.at(this.editingIndex.value).get('subCode')?.setValue(subCode.code);
    }
    this.closeSubCodesDialog();
  }

  chooseSecondSubCode(secondSubCode: SecondSubCode) {
    if (this.editingIndex.value != null) {
      this.reasonCodesFormArray.at(this.editingIndex.value).get('subCode')?.setValue(secondSubCode.code);
    }
    this.closeSubCodesDialog();
  }

  assignEditingIndex(editingIndex: number) {
    console.log(editingIndex);
    this.editingIndex.next(editingIndex);
  }
}
