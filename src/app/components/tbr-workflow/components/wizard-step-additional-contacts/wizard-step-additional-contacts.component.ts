import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArray, IFormBuilder } from '@rxweb/types';
import { BehaviorSubject } from 'rxjs';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';

const contactTypes = [
  { value: 'BOOK_ON_BEHALF_OF', title: 'Book on behalf on' },
  { value: 'APPROVE_ON_BEHALF_OF', title: 'Approve on behalf on' },
  { value: 'CONTACT_AT_SUPPLIER', title: 'Contact at Supplier' },
  { value: 'CONTACT_AT_CARRIER', title: 'Contact at Carrier' },
  { value: 'CONTACT_AT_CROSS_DOCK', title: 'Contact at XDock' },
  { value: 'CONTACT_AT_GOODS_RECEIVING', title: 'Contact at goods receiving' },
];

interface AdditionalContactData {
  contactType: string;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-wizard-step-additional-contacts',
  templateUrl: './wizard-step-additional-contacts.component.html',
  styleUrls: ['./wizard-step-additional-contacts.component.scss'],
})
export class WizardStepAdditionalContactsComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  private fb: IFormBuilder;
  private editingIndex = new BehaviorSubject<number | null>(null);

  @ViewChild('contactTypeDialog')
  contactTypeDialog!: DialogComponent;

  additionalContactsFormArray!: IFormArray<AdditionalContactData>;
  openTypeDialog!: () => void;
  contactTypes = contactTypes;

  constructor(fb: FormBuilder) {
    super();
    this.fb = fb;
    this.createForm();
  }

  ngAfterViewInit(): void {
    this.openTypeDialog = WizardStepAdditionalContactsComponent.openDialog.bind(this, this.contactTypeDialog);
  }

  isValid(): boolean {
    return true;
  }

  addAdditionalContact() {
    this.additionalContactsFormArray.push(
      this.fb.group<AdditionalContactData>({
        contactType: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        name: [null],
        phone: [null, [Validators.pattern('/^\\+(?:[0-9] ?){6,14}[0-9]$/')]],
      })
    );
  }

  assignEditingIndex(editingIndex: number) {
    this.editingIndex.next(editingIndex);
  }

  getFormGroup(rowForm: any) {
    return rowForm as FormGroup;
  }

  closeContactTypeDialog() {
    this.editingIndex.next(null);
    this.contactTypeDialog.closeDialog();
  }

  chooseContactType(contactType: string) {
    if (this.editingIndex.value != null) {
      this.additionalContactsFormArray.at(this.editingIndex.value).get('contactType')?.setValue(contactType);
    }
    this.closeContactTypeDialog();
  }

  private createForm() {
    this.additionalContactsFormArray = this.fb.array<AdditionalContactData>([]);
    this.additionalContactsFormArray.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }
}
