import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TbrService } from '../../services';
import { TbrLine } from '../../models/tbr-line.model';
import { addLine, goToWorkflow, selectedTbr, splitLine, updateReference } from '../../state';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { Tbr } from '../../models/tbr.model';
import { CommonValidators } from '../../utils/validators';

interface AddLineForm {
  partNo: string;
  plannedQty: number;
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

  @ViewChild('linesTable')
  linesTable!: ElementRef;

  private details$ = this.store.select(selectedTbr);
  tbrDetails?: Tbr;
  lines?: any[];
  selectedRowsIndexes: number[] = [];
  addLineFormGroup!: IFormGroup<AddLineForm>;
  addRefFormGroup!: IFormGroup<AddRefForm>;
  deliveryDateFormControl!: IFormControl<string>;

  private fb: IFormBuilder;

  constructor(private router: Router, private tbrService: TbrService, private store: Store, fb: FormBuilder) {
    this.fb = fb;
    this.createForm();

    this.details$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.tbrDetails = value;
      if (this.tbrDetails == null) {
        return;
      }
      this.lines = value?.lines.map((line) => {
        const packagedQuantityControl = this.fb.control<string>(line.packagedQuantity, [Validators.required]);
        const typeControl = this.fb.control<string>(line.type, [Validators.required]);

        return {
          ...line,
          packagedQuantityControl,
          typeControl,
        };
      });
      this.patchForm(this.tbrDetails);
    });
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  openAddDialog(): void {
    this.addLineDialog.openDialog();
  }

  saveAddLine(): void {
    const newLineData = this.addLineFormGroup.getRawValue();
    this.addLineFormGroup.reset();
    this.addLineFormGroup.markAsPristine();

    if (this.tbrDetails) {
      this.store.dispatch(
        addLine({
          data: {
            shipItId: this.tbrDetails.shipitId,
            ...newLineData,
          },
        })
      );
    }
    this.cancelAddLine();
  }

  cancelAddLine(): void {
    this.addLineDialog.closeDialog();
  }

  openAddRefDialog(): void {
    this.addReferencesDialog.openDialog();
  }

  saveAddRef(): void {
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

  cancelAddRef(): void {
    this.addRefFormGroup.reset();
    this.addRefFormGroup.markAsPristine();
    this.addReferencesDialog.closeDialog();
  }

  navigateToThuDetails(event: MouseEvent, line: TbrLine, shipitId: string): void {
    const anyEvent = event as any;
    const pathHasCheckbox = anyEvent.path
      .map((path: { classList: DOMTokenList }) => path.classList?.toString() || '')
      .includes('ui5-checkbox-inner');

    if (pathHasCheckbox || anyEvent.target.id.includes('custom-input')) {
      return;
    }
    this.router.navigate(['/', 'xtr', shipitId, line.articleNumber]);
  }

  split(): void {
    if (this.tbrDetails == null) {
      return;
    }

    const releaseLines = this.lines
      ?.filter((_, i) => this.selectedRowsIndexes.includes(i))
      .map((line) => line.releaseLineId)
      .toString();

    if (releaseLines == null) {
      return;
    }

    const data = {
      shipItId: this.tbrDetails.shipitId,
      releaseLines,
    };
    this.store.dispatch(splitLine({ data }));
  }

  selectionChange(e: Event) {
    this.selectedRowsIndexes = (e as any).detail.selectedRows
      .map((row: HTMLElement) => row.getAttribute('data-index'))
      .filter((index: string | null) => index != null)
      .map((index: string) => parseInt(index, 10));
  }

  goToWorkflow() {
    const areLinesInvalid: boolean =
      this.lines == null ||
      this.lines?.length === 0 ||
      this.lines?.some((line) => line.packagedQuantityControl.invalid || line.typeControl.invalid);

    if (this.deliveryDateFormControl.invalid && areLinesInvalid) {
      return;
    }
    // this.store.dispatch go to workflow, change status, navigate to workflow
    const currentStatus = this.tbrDetails?.shipitStatus;
    if (currentStatus == null || currentStatus === 'SENT_FOR_APPROVAL' || currentStatus === 'APPROVAL_CONFIRM') {
      return;
    }

    const status = this.tbrDetails?.shipitStatus === 'RO_APPROVAL_REJECTED' ? 'APPROVAL_IN_PROCESS' : 'IN_PROCESS';
    this.store.dispatch(goToWorkflow({ data: status }));
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

    this.deliveryDateFormControl = this.fb.control<string>(null, [Validators.required, CommonValidators.IsNotPastDateValidator()]);
  }

  private patchForm(value: Tbr): void {
    this.deliveryDateFormControl.patchValue(value?.deliveryDate ?? null);
  }
}
