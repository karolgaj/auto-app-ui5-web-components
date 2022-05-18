import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectedTbr, updateTbr } from '../../../../state';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { Tbr } from '../../../../models/tbr.model';

@UntilDestroy()
@Component({
  selector: 'app-wizard-summary',
  templateUrl: './wizard-summary.component.html',
})
export class WizardSummaryComponent implements OnInit {
  @ViewChild('pickupInfo')
  private pickupInfo!: DialogComponent;
  @ViewChild('contactPerson')
  private contactPerson!: DialogComponent;
  @ViewChild('transportType')
  private transportType!: DialogComponent;
  @ViewChild('costOwner')
  private costOwner!: DialogComponent;
  @ViewChild('reasonCode')
  private reasonCode!: DialogComponent;
  @ViewChild('internalNote')
  private internalNoteDialog!: DialogComponent;
  @ViewChild('additionalContacts')
  private additionalContacts!: DialogComponent;

  details$ = this.store.select(selectedTbr);
  internalNote = new FormControl([]);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.details$.pipe(untilDestroyed(this)).subscribe((value) => {
      this.internalNote.patchValue(value?.internalNote);
      this.internalNote.disable();
    });
  }

  close(): void {}

  editSection(
    pickupInfo: 'PICKUP_INFO' | 'CONTACT_PERSON' | 'TRANSPORT_TYPE' | 'COST_OWNER' | 'REASON_CODE' | 'NOTE' | 'ADDITIONAL_CONTACTS'
  ): void {
    switch (pickupInfo) {
      case 'PICKUP_INFO':
        this.pickupInfo.openDialog();
        break;
      case 'CONTACT_PERSON':
        this.contactPerson.openDialog();
        break;
      case 'TRANSPORT_TYPE':
        this.transportType.openDialog();
        break;
      case 'COST_OWNER':
        this.costOwner.openDialog();
        break;
      case 'REASON_CODE':
        this.reasonCode.openDialog();
        break;
      case 'NOTE':
        this.internalNoteDialog.openDialog();
        break;
      case 'ADDITIONAL_CONTACTS':
        this.additionalContacts.openDialog();
        break;
      default:
    }
  }

  updateValue(value: Partial<Tbr>): void {
    this.store.dispatch(updateTbr({ data: value }));
  }
}
