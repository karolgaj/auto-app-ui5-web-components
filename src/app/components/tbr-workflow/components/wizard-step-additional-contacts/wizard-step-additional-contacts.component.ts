import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArray } from '@rxweb/types';
import { BehaviorSubject } from 'rxjs';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { AdditionalContact, Tbr } from '../../../../models/tbr.model';
import { contactTypes, requesterContactTypes } from '../../constants';
import { WizardStepAbstract } from '../wizard-step-abstract';

@Component({
  selector: 'app-wizard-step-additional-contacts',
  templateUrl: './wizard-step-additional-contacts.component.html',
})
export class WizardStepAdditionalContactsComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  @Input()
  isRequester = false;

  @ViewChild('contactTypeDialog')
  contactTypeDialog!: DialogComponent;

  private editingIndex = new BehaviorSubject<number | null>(null);
  form!: IFormArray<AdditionalContact>;
  openTypeDialog!: () => void;
  contactTypes = contactTypes;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngAfterViewInit(): void {
    this.openTypeDialog = WizardStepAdditionalContactsComponent.openDialog.bind(this, this.contactTypeDialog);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contactTypes = this.isRequester ? requesterContactTypes : contactTypes;
  }

  addAdditionalContact(additionalContact?: AdditionalContact): void {
    const form = this.fb.group<AdditionalContact>({
      contactType: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      name: [null],
      phone: [null, [Validators.pattern('^\\+(?:[0-9] ?){6,14}[0-9]$')]],
    });

    if (additionalContact) {
      form.patchValue(additionalContact);
    }

    this.form.push(form);
  }

  assignEditingIndex(editingIndex: number): void {
    this.editingIndex.next(editingIndex);
  }

  getFormGroup(rowForm: unknown): FormGroup {
    return rowForm as FormGroup;
  }

  closeContactTypeDialog(): void {
    this.editingIndex.next(null);
    this.contactTypeDialog.closeDialog();
  }

  chooseContactType(contactType: string): void {
    if (this.editingIndex.value != null) {
      this.form.at(this.editingIndex.value).get('contactType')?.setValue(contactType);
    }
    this.closeContactTypeDialog();
  }

  getData(): Partial<Tbr> {
    return {
      additionalContacts: this.form.getRawValue(),
    };
  }

  protected createForm(): void {
    this.form = this.fb.array<AdditionalContact>([]);
  }

  protected patchInitialForm(): void {
    setTimeout(() => {
      this.data.approvalDecision?.additionalContacts?.forEach((additionalContact: AdditionalContact) => {
        this.addAdditionalContact(additionalContact);
      });
    });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  contactTypeFormatter = (value: string) => {
    return contactTypes.find((contactType) => contactType.value === value)?.title || value;
  };
}
