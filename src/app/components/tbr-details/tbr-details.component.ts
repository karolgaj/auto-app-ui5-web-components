import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { TransportHandlingUnit } from 'src/app/models/transport-handling-unit.model';
import { combineLatest, startWith } from 'rxjs';
import { ThuDetails } from 'src/app/models/thu-details';
import { TbrService } from '../../services';
import { TbrLine } from '../../models/tbr-line.model';
import {
  addLine,
  addLineWithoutPartNumber,
  goToWorkflow,
  goToWorkflowSummary,
  selectedTbr,
  loadThuData,
  selectThu,
  selectThuList,
  splitLine,
  updateReference,
  setManualThu,
  deleteLine,
  selectSubThuList,
  selectPlantSpecificList,
} from '../../state';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { Tbr } from '../../models/tbr.model';
import { CommonValidators } from '../../utils/validators';

const WORKFLOW_STATUSES_FOR_SUMMARY = ['SENT_FOR_APPROVAL', 'CREATED', 'APPROVAL_REJECTED', 'RO_APPROVAL_REJECTED', 'APPROVAL_IN_PROCESS'];

interface AddLineForm {
  partNo: string;
  plannedQty: number;
  poNumber: string;
  description: string;
  weight: string;
}

interface AddLineOptions {
  text: string;
  value: string;
}

interface AddRefForm {
  msgToCarrier: string;
  pickupRef: string;
  dispatchAdviceNumber: string;
  orderNumber: string;
  doNotMerge: string;
}

interface ExtendedTbrLine extends TbrLine {
  packagedQuantityControl: IFormControl<string>;
  typeControl: IFormControl<string>;
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

  @ViewChild('thuListSelectDialog')
  thuListSelectDialog!: DialogComponent;

  @ViewChild('manualThuDetailsDialog')
  manualThuDetailsDialog!: DialogComponent;

  @ViewChild('linesTable')
  linesTable!: ElementRef;

  private details$ = this.store.select(selectedTbr);
  private editedLine?: TbrLine;
  thuList$ = this.store.select(selectThuList);
  subThuList$ = this.store.select(selectSubThuList);
  plantSpecificList$ = this.store.select(selectPlantSpecificList);
  selectedThuList$ = this.store.select(selectThuList);

  thuDetails$ = this.store.select(selectThu);

  addLineOptions: AddLineOptions[] = [
    { text: 'COMMON.VOLVO_GROUP_PART', value: 'VolvoPart' },
    { text: 'COMMON.NO_PART_NUMBER_AVAILIABLE', value: 'OtherPart' },
  ];

  tbrDetails?: Tbr;
  manualThu?: ThuDetails;
  lines?: ExtendedTbrLine[];

  selectedRowsIndexes: number[] = [];
  selectedTabIndex = 0;

  openThuListDialogBound = this.openThuListDialog.bind(this);
  addLineFormGroup!: IFormGroup<AddLineForm>;
  addRefFormGroup!: IFormGroup<AddRefForm>;
  thuListSelecFormGroup!: IFormGroup<TransportHandlingUnit>;
  addLineType = this.addLineOptions[0].value;
  deliveryDateFormControl!: IFormControl<string>;
  addLineOptionsFormControl!: IFormControl<string>;
  private fb: IFormBuilder;
  constructor(private router: Router, private tbrService: TbrService, private store: Store, fb: FormBuilder) {
    this.fb = fb;
    this.createForm();
    this.details$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.tbrDetails = value;
      if (this.tbrDetails == null) {
        return;
      }
      this.lines = value?.lines?.map((line) => {
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

    this.thuDetails$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.manualThu = value;
    });

    this.watchForm();
  }
  goBack(): void {
    this.router.navigate(['../']);
  }
  openAddDialog(): void {
    this.addLineDialog.openDialog();
  }
  openThuListDialog(): void {
    this.thuListSelectDialog.openDialog();
  }
  openManualThuDetailsDialog(): void {
    this.manualThuDetailsDialog.openDialog();
  }

  cancelAddLine(): void {
    this.addLineDialog.closeDialog();
  }
  cancelManualThuDetails(): void {
    this.manualThuDetailsDialog.closeDialog();
  }
  cancelSelectThuType(): void {
    this.thuListSelectDialog.closeDialog();
  }

  openAddRefDialog(): void {
    this.addReferencesDialog.openDialog();
  }

  saveManualThuDetails() {
    if (this.tbrDetails && this.manualThu && this.editedLine) {
      this.store.dispatch(
        setManualThu({
          shipItId: this.tbrDetails.shipitId,
          releaseLineId: this.editedLine.releaseLineId,
          pi: this.manualThu,
        })
      );
    }
    this.cancelManualThuDetails();
  }

  saveAddLine(): void {
    const newLineData = this.addLineFormGroup.getRawValue();
    this.addLineFormGroup.reset();
    this.addLineFormGroup.markAsPristine();

    if (this.tbrDetails) {
      if (this.addLineType === 'VolvoPart') {
        this.store.dispatch(
          addLine({
            data: {
              shipItId: this.tbrDetails.shipitId,
              ...newLineData,
            },
          })
        );
      } else if (this.addLineType === 'OtherPart') {
        this.store.dispatch(
          addLineWithoutPartNumber({
            data: {
              shipItId: this.tbrDetails.shipitId,
              ...newLineData,
            },
          })
        );
      }
    }
    this.cancelAddLine();
  }

  deleteLine(): void {
    if (this.tbrDetails && this.editedLine) {
      this.store.dispatch(
        deleteLine({
          data: {
            shipItId: this.tbrDetails.shipitId,
            releaseLineId: this.editedLine.releaseLineId,
          },
        })
      );
    }
  }
  selectThu(selectedThuId: string): void {
    this.thuListSelecFormGroup.controls.thuId.setValue(selectedThuId);
    this.cancelSelectThuType();
    this.openManualThuDetailsDialog();
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
    this.editedLine = line;
    const pathHasCheckbox = anyEvent.path
      .map((path: { classList: DOMTokenList }) => path.classList?.toString() || '')
      .includes('ui5-checkbox-inner');

    if (pathHasCheckbox || anyEvent.target.id.includes('custom-input') || anyEvent.srcElement.localName === 'ui5-icon') {
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
  tabSelectionChange(e: Event) {
    this.selectedTabIndex = (e as any).detail.tabIndex;
    console.log('selectedTabIndex', this.selectedTabIndex);
  }

  goToWorkflow() {
    const areLinesInvalid: boolean =
      this.lines == null ||
      this.lines?.length === 0 ||
      this.lines?.some((line) => line.packagedQuantityControl.invalid || line.typeControl.invalid);

    if (this.deliveryDateFormControl.invalid && areLinesInvalid) {
      this.deliveryDateFormControl.markAsTouched();
      return;
    }

    const currentStatus = this.tbrDetails?.shipitStatus;
    if (currentStatus == null || currentStatus === 'SENT_FOR_APPROVAL' || currentStatus === 'APPROVAL_CONFIRM') {
      return;
    }

    if (WORKFLOW_STATUSES_FOR_SUMMARY.includes(currentStatus)) {
      this.store.dispatch(goToWorkflowSummary({ data: this.tbrDetails }));
      return;
    }

    const status = this.tbrDetails?.shipitStatus === 'RO_APPROVAL_REJECTED' ? 'APPROVAL_IN_PROCESS' : 'IN_PROCESS';
    this.store.dispatch(goToWorkflow({ data: { status, deliveryDate: this.deliveryDateFormControl.value as string } }));
  }

  private createForm(): void {
    this.addLineFormGroup = this.fb.group<AddLineForm>({
      partNo: [null, Validators.required],
      plannedQty: [null, Validators.required],
      poNumber: [null, Validators.required],
      description: [null, Validators.required],
      weight: [null, Validators.required],
    });

    this.addRefFormGroup = this.fb.group<AddRefForm>({
      dispatchAdviceNumber: [null],
      doNotMerge: [null],
      msgToCarrier: [null],
      orderNumber: [null],
      pickupRef: [null],
    });

    this.thuListSelecFormGroup = this.fb.group<TransportHandlingUnit>({
      description: [null],
      id: [null],
      thuId: [null],
    });

    this.addLineOptionsFormControl = this.fb.control<string>(this.addLineOptions[0].value);
    this.deliveryDateFormControl = this.fb.control<string>(null, [Validators.required, CommonValidators.IsNotPastDateValidator()]);
  }

  private patchForm(value: Tbr): void {
    this.deliveryDateFormControl.patchValue(value?.deliveryDate ?? null);
    this.addRefFormGroup.patchValue({
      msgToCarrier: value.messageToCarrier,
      dispatchAdviceNumber: value.dispatchAdviceNumber,
      pickupRef: value.pickupReference,
    });
  }

  private watchForm(): void {
    this.addLineOptionsFormControl.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) this.addLineType = value;
    });

    combineLatest([this.thuListSelecFormGroup.controls.thuId.valueChanges.pipe(startWith(this.thuListSelecFormGroup.controls.thuId.value))])
      .pipe(untilDestroyed(this))
      .subscribe(([selectedThuId]) => {
        if (selectedThuId && this.tbrDetails) {
          this.store.dispatch(
            loadThuData({
              data: {
                thuId: selectedThuId,
                shipFromId: this.tbrDetails.shipFrom.parma,
              },
            })
          );
        }
      });
  }
}
