import { WizardStepContactComponent } from './components/wizard-step-contact/wizard-step-contact.component';
import { WizardStepCostOwnerComponent } from './components/wizard-step-cost-owner/wizard-step-cost-owner.component';
import { WizardStepReasonCodeComponent } from './components/wizard-step-reason-code/wizard-step-reason-code.component';
import { WizardStepNoteComponent } from './components/wizard-step-note/wizard-step-note.component';
import { WizardStepPickupInfoComponent } from './components/wizard-step-pickup-info/wizard-step-pickup-info.component';
import { WizardSummaryComponent } from './components/wizard-summary/wizard-summary.component';
import { WizardStepAdditionalContactsComponent } from './components/wizard-step-additional-contacts/wizard-step-additional-contacts.component';
import { WizardStepTransportTypeComponent } from './components/wizard-step-transport-type/wizard-step-transport-type.component';
import { TbrWorkflowComponent } from './tbr-workflow.component';

export { WizardSummaryComponent };

export const WORKFLOW_COMPONENTS = [
  WizardStepAdditionalContactsComponent,
  WizardStepContactComponent,
  WizardStepCostOwnerComponent,
  WizardStepNoteComponent,
  WizardStepPickupInfoComponent,
  WizardStepReasonCodeComponent,
  WizardStepTransportTypeComponent,
  WizardSummaryComponent,
  TbrWorkflowComponent,
];
