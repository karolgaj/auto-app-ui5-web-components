import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { WizardStepAbstract } from '../wizard-step-abstract';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IFormArray } from '@rxweb/types';
import { BehaviorSubject } from 'rxjs';
import { DialogComponent } from '../../../../ui/dialog/dialog.component';
import { contactTypes } from '../../constants';
import { AdditionalContact, Tbr } from '../../../../models/tbr.model';

@Component({
  selector: 'app-wizard-step-additional-contacts',
  templateUrl: './wizard-step-additional-contacts.component.html',
})
export class WizardStepAdditionalContactsComponent extends WizardStepAbstract implements OnInit, AfterViewInit {
  private editingIndex = new BehaviorSubject<number | null>(null);

  @ViewChild('contactTypeDialog')
  contactTypeDialog!: DialogComponent;

  form!: IFormArray<AdditionalContact>;
  openTypeDialog!: () => void;
  contactTypes = contactTypes;

  constructor(fb: FormBuilder) {
    super(fb);
  }

  ngAfterViewInit(): void {
    this.openTypeDialog = WizardStepAdditionalContactsComponent.openDialog.bind(this, this.contactTypeDialog);
  }

  addAdditionalContact(): void {
    this.form.push(
      this.fb.group<AdditionalContact>({
        contactType: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        name: [null],
        phone: [null, [Validators.pattern('/^\\+(?:[0-9] ?){6,14}[0-9]$/')]],
      })
    );
  }

  assignEditingIndex(editingIndex: number): void {
    this.editingIndex.next(editingIndex);
  }

  getFormGroup(rowForm: any): FormGroup {
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
    this.form.valueChanges.subscribe((val) => {
      console.log(val);
    });
  }

  protected patchInitialForm(): void {
    if (this.data.additionalContacts) {
      this.form.patchValue(this.data.additionalContacts);
    }
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }
}
