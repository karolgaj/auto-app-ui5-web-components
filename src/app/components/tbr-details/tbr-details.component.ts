import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TbrService } from '../../services/tbr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TbrLine } from '../../models/tbr-line.model';
import { Store } from '@ngrx/store';
import { selectedTbr } from '../../state/tbr.selectors';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { DialogComponent } from '../../ui/dialog/dialog.component';

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

@Component({
  selector: 'app-tbr-details',
  templateUrl: './tbr-details.component.html',
  styleUrls: ['./tbr-details.component.scss'],
})
export class TbrDetailsComponent {
  @ViewChild('addLineDialog')
  addLineDialog!: DialogComponent;

  @ViewChild('addReferencesDialog')
  addReferencesDialog!: DialogComponent;

  details$ = this.store.select(selectedTbr);
  addLineFormGroup!: IFormGroup<AddLineForm>;
  addRefFormGroup!: IFormGroup<AddRefForm>;

  private fb: IFormBuilder;

  constructor(private router: Router, private tbrService: TbrService, private store: Store, fb: FormBuilder) {
    this.fb = fb;
    this.createForm();
  }

  goBack() {
    this.router.navigate(['../']);
  }

  openAddDialog() {
    this.addLineDialog.openDialog();
  }

  saveAddLine() {
    this.cancelAddLine();
  }

  cancelAddLine() {
    this.addLineDialog.closeDialog();
  }

  openAddRefDialog() {
    this.addReferencesDialog.openDialog();
  }

  saveAddRef() {
    this.cancelAddRef();
  }

  cancelAddRef() {
    this.addReferencesDialog.closeDialog();
  }

  navigateToThuDetails(line: TbrLine, shipitId: string) {
    this.router.navigate(['/', shipitId, line.articleNumber]);
  }

  split() {
    //add logic
    console.log('Split a line into two via an Interface in XTR MS');
  }

  log(e: any) {
    console.log(e);
  }

  goToWorkflow(shipitId: string) {
    this.router.navigate(['/workflow', shipitId]);
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
  }
}
