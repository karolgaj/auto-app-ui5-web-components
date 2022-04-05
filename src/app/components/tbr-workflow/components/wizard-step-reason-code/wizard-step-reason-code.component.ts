import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { Store } from '@ngrx/store';
import { selectCauses } from '../../../../state/tbr/tbr.selectors';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFormArray } from '@rxweb/types';
import { loadReasonCodes } from '../../../../state/tbr/tbr.actions';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SecondSubCode, SubCode } from '../../../../models/reason-code.model';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Tbr } from '../../../../models/tbr.model';

interface ReasonCodeData {
  cause: string;
  subCode: string;
  secondSubCode: string;
  reference: string;
}

@Component({
  selector: 'app-wizard-step-reason-code',
  templateUrl: './wizard-step-reason-code.component.html',
})
export class WizardStepReasonCodeComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  private editingIndex = new BehaviorSubject<number | null>(null);

  @ViewChild('reasonCodeDialog')
  reasonCodeDialog!: DialogComponent;

  @ViewChild('subCodeDialog')
  subCodeDialog!: DialogComponent;

  @ViewChild('secondSubCodeDialog')
  secondSubCodeDialog!: DialogComponent;

  reasonCodes$ = this.store.select(selectCauses());
  subCodes$: Observable<SubCode[] | null | undefined> = this.editingIndex.pipe(
    map((editingIndex) => {
      if (editingIndex == null) {
        return null;
      }
      return this.form.at(editingIndex).get('cause')?.value;
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
      const editingIndex = this.editingIndex.value;
      if (editingIndex != null) {
        const subCode = this.form.at(editingIndex).get('subCode')?.value;

        if (subCode) {
          return subCodes?.find((sc) => sc.code === subCode)?.secondSubCodes;
        }
      }

      return [];
    })
  );

  form!: IFormArray<ReasonCodeData>;

  openReasonCodesDialog!: () => void;
  openSecondSubCodesDialog!: () => void;
  openSubCodesDialog!: () => void;

  constructor(private store: Store, fb: FormBuilder) {
    super(fb);
    this.store.dispatch(loadReasonCodes());
  }

  ngAfterViewInit(): void {
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

  addReasonCode(): void {
    this.form.push(
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

  closeReasonCodesDialog(): void {
    this.editingIndex.next(null);
    this.reasonCodeDialog.closeDialog();
  }

  closeSubCodesDialog(): void {
    this.editingIndex.next(null);
    this.subCodeDialog.closeDialog();
  }

  closeSecondSubCodesDialog(): void {
    this.editingIndex.next(null);
    this.secondSubCodeDialog.closeDialog();
  }

  chooseReasonCode(cause: number): void {
    if (this.editingIndex.value != null) {
      this.form.at(this.editingIndex.value).get('cause')?.setValue(cause);
    }
    this.closeReasonCodesDialog();
  }

  chooseSubCode(subCode: SubCode): void {
    if (this.editingIndex.value != null) {
      this.form.at(this.editingIndex.value).get('subCode')?.setValue(subCode.code);
    }
    this.closeSubCodesDialog();
  }

  chooseSecondSubCode(secondSubCode: SecondSubCode): void {
    if (this.editingIndex.value != null) {
      this.form.at(this.editingIndex.value).get('subCode')?.setValue(secondSubCode.code);
    }
    this.closeSubCodesDialog();
  }

  assignEditingIndex(editingIndex: number): void {
    this.editingIndex.next(editingIndex);
  }

  getData(): Partial<Tbr> {
    return {
      approvalDecision: {
        reasonCodes: this.form.getRawValue(),
      },
    };
  }

  protected createForm(): void {
    this.form = this.fb.array<ReasonCodeData>([]);
  }

  protected patchInitialForm(): void {}

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }
}
