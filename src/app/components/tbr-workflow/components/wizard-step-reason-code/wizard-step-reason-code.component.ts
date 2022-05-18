import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IFormArray } from '@rxweb/types';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { ReasonCode, SecondSubCode, SubCode } from '../../../../models/reason-code.model';
import { Tbr } from '../../../../models/tbr.model';
import { selectCauses } from '../../../../state/dictionaries/dictionaries.selectors';
import { loadReasonCodes } from '../../../../state/dictionaries/dictionaries.actions';

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
  @Input()
  payer!: 'SUPPLIER' | 'VOLVO';

  @ViewChild('reasonCodeDialog')
  reasonCodeDialog!: DialogComponent;

  @ViewChild('subCodeDialog')
  subCodeDialog!: DialogComponent;

  @ViewChild('secondSubCodeDialog')
  secondSubCodeDialog!: DialogComponent;

  private editingIndex = new BehaviorSubject<number | null>(null);

  causes: ReasonCode[] = [];
  reasonCodes: SubCode[] = [];
  subReasonCodes: SecondSubCode[] = [];

  reasonCodes$!: Observable<ReasonCode[]>;

  subCodes$!: Observable<SubCode[] | null | undefined>;

  secondSubCodes$!: Observable<SecondSubCode[] | null | undefined>;

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

  ngOnInit(): void {
    super.ngOnInit();
    this.reasonCodes$ = this.store.select(selectCauses(this.payer));

    this.subCodes$ = this.editingIndex.pipe(
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
        return this.reasonCodes$.pipe(map((reasonCodes) => reasonCodes.find((reasonCode) => reasonCode.generalCode === value)?.subCodes));
      })
    );

    this.secondSubCodes$ = this.subCodes$.pipe(
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

    this.reasonCodes$.pipe(filter(Boolean), take(1)).subscribe((reasonCodes) => {
      this.causes = reasonCodes;
      this.reasonCodes = reasonCodes.reduce((acc: SubCode[], curr) => acc.concat(curr.subCodes || []), []);
      this.subReasonCodes = this.reasonCodes.reduce((acc: SecondSubCode[], curr) => acc.concat(curr.secondSubCodes || []), []);
    });
  }

  addReasonCode(reasonCode?: ReasonCodeData): void {
    const form = this.fb.group<ReasonCodeData>({
      cause: [null],
      subCode: [null],
      secondSubCode: [null],
      reference: [null],
    });

    if (reasonCode) {
      form.patchValue(reasonCode);
    }

    this.form.push(form);
  }

  getFormGroup(rowForm: unknown): FormGroup {
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
      this.form.at(this.editingIndex.value).get('secondSubCode')?.setValue(secondSubCode.code);
    }
    this.closeSecondSubCodesDialog();
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

  protected patchInitialForm(): void {
    setTimeout(() => {
      this.data.approvalDecision?.reasonCodes?.forEach((reasonCode: ReasonCodeData) => {
        this.addReasonCode(reasonCode);
      });
    });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  causeFormatter = (value: number) => {
    return this.causes.find((reasonCode) => reasonCode.generalCode === value)?.cause || value;
  };

  reasonCodeFormatter = (value: number) => {
    return this.reasonCodes.find((reasonCode) => reasonCode.code === value)?.description || value;
  };

  subReasonCodeFormatter = (value: number) => {
    return this.subReasonCodes.find((reasonCode) => reasonCode.code === value)?.description || value;
  };
}
