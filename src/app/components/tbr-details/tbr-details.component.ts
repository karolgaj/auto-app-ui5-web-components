import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs/operators';

import { TbrService } from '../../services';
import { TbrLine } from '../../models/tbr-line.model';
import { selectedTbr, updateReference } from '../../state';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { Tbr } from '../../models/tbr.model';
import { CommonValidators } from '../../utils/validators';

interface AddLineForm {
  partNo: string;
  plannedQty: string;
  poNumber: string;
}

interface AddRefForm {
  msgToCarrier: string;
  pickupRef: string;
  dispatchAdviceNumber: string;
  orderNumber: string;
  doNotMerge: string;
}

@UntilDestroy()
@Component({
  selector: 'app-tbr-details',
  templateUrl: './tbr-details.component.html',
})
export class TbrDetailsComponent {
  @ViewChild('addLineDialog')
  addLineDialog!: DialogComponent;

  @ViewChild('addReferencesDialog')
  addReferencesDialog!: DialogComponent;

  private details$ = this.store.select(selectedTbr);
  tbrDetails?: Tbr;
  lines?: any[];
  addLineFormGroup!: IFormGroup<AddLineForm>;
  addRefFormGroup!: IFormGroup<AddRefForm>;
  deliveryDateFormControl!: IFormControl<string>;

  private fb: IFormBuilder;

  constructor(private router: Router, private tbrService: TbrService, private store: Store, fb: FormBuilder) {
    this.fb = fb;
    this.details$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.tbrDetails = value;
      this.lines = value?.lines.map((line) => {
        const packagedQuantityControl = this.fb.control<number>(line.packagedQuantity, [Validators.required]);
        const typeControl = this.fb.control<number>(line.type, [Validators.required]);

        return {
          ...line,
          packagedQuantityControl,
          typeControl,
        };
      });
    });
    this.createForm();
    this.patchForm();
  }

  goBack() {
    this.router.navigate(['../']);
  }

  openAddDialog() {
    this.addLineDialog.openDialog();
  }

  saveAddLine() {
    const newLineData = this.addLineFormGroup.getRawValue();
    this.addLineFormGroup.reset();
    this.addLineFormGroup.markAsPristine();

    this.cancelAddLine();
  }

  cancelAddLine() {
    this.addLineDialog.closeDialog();
  }

  openAddRefDialog() {
    this.addReferencesDialog.openDialog();
  }

  saveAddRef() {
    this.store.dispatch(
      updateReference({
        data: {
          shipitId: this.tbrDetails?.shipitId,
          ...this.addRefFormGroup.getRawValue(),
        },
      })
    );
    this.cancelAddRef();
  }

  cancelAddRef() {
    this.addRefFormGroup.reset();
    this.addRefFormGroup.markAsPristine();
    this.addReferencesDialog.closeDialog();
  }

  navigateToThuDetails(line: TbrLine, shipitId: string) {
    this.router.navigate(['/', 'xtr', shipitId, line.articleNumber]);
  }

  split() {
    //add logic
    console.log('Split a line into two via an Interface in XTR MS');
  }

  log(e: any) {
    console.log(e);
  }

  goToWorkflow(shipitId: string) {
    const areLinesInvalid: boolean =
      this.lines == null ||
      this.lines?.length === 0 ||
      this.lines?.some((line) => line.packagedQuantityControl.invalid || line.typeControl.invalid);

    if (this.deliveryDateFormControl.invalid && areLinesInvalid) {
      return;
    }
    // this.store.dispatch go to workflow, change status, navigate to workflow
    this.router.navigate(['/', 'xtr', 'workflow', shipitId]);
  }

  private createForm(): void {
    this.addLineFormGroup = this.fb.group<AddLineForm>({
      partNo: [null, Validators.required],
      plannedQty: [null, Validators.required],
      poNumber: [null, Validators.required],
    });

    this.addRefFormGroup = this.fb.group<AddRefForm>({
      dispatchAdviceNumber: [null],
      doNotMerge: [null],
      msgToCarrier: [null],
      orderNumber: [null],
      pickupRef: [null],
    });

    this.deliveryDateFormControl = this.fb.control<string>(null, [Validators.required, CommonValidators.IsNotPastDateValidator]);
  }

  private patchForm(): void {
    this.details$
      .pipe(
        filter((value) => !!value),
        take(1)
      )
      .subscribe((value) => {
        this.deliveryDateFormControl.patchValue(value?.deliveryDate ?? null);
      });
  }
}
