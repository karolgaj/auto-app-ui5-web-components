import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// @ts-ignore
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
import { TbrListComponent } from './components/tbr-list/tbr-list.component';
import { TbrDetailsComponent } from './components/tbr-details/tbr-details.component';
import { TbrEmptyStateComponent } from './components/tbr-empty-state/tbr-empty-state.component';
import { TbrTypePipe } from './pipes/tbr-type.pipe';
import { AddressPipe } from './pipes/address.pipe';
import { ConsignorTextPipe } from './pipes/consignor-text.pipe';
import { ThuAmountPipe } from './pipes/thu-amount.pipe';
import { ParseDatePipe } from './pipes/parse-date.pipe';
import { TbrNetworkComponent } from './components/tbr-network/tbr-network.component';
import { ShipitStatusPipe } from './pipes/shipit-status.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThuDetailsComponent } from './components/thu-details/thu-details.component';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TbrNetworkFormComponent } from './components/tbr-network-form/tbr-network-form.component';
import { CheckboxComponent, DatepickerComponent, InputComponent, TimepickerComponent } from './ui/input';
import { DialogComponent } from './ui/dialog/dialog.component';
import { StateModule } from './state/state.module';
import { EffectsModule } from '@ngrx/effects';
import { SelectComponent } from './ui/input/select/select.component';
import { TbrWorkflowComponent } from './components/tbr-workflow/tbr-workflow.component';
import { WizardStepPickupInfoComponent } from './components/tbr-workflow/components/wizard-step-pickup-info/wizard-step-pickup-info.component';
import { WizardStepTransportTypeComponent } from './components/tbr-workflow/components/wizard-step-transport-type/wizard-step-transport-type.component';
import { WizardStepContactComponent } from './components/tbr-workflow/components/wizard-step-contact/wizard-step-contact.component';
import { WizardStepCostOwnerComponent } from './components/tbr-workflow/components/wizard-step-cost-owner/wizard-step-cost-owner.component';
import { WizardStepReasonCodeComponent } from './components/tbr-workflow/components/wizard-step-reason-code/wizard-step-reason-code.component';
import { WizardStepNoteComponent } from './components/tbr-workflow/components/wizard-step-note/wizard-step-note.component';
import { WizardStepAdditionalContactsComponent } from './components/tbr-workflow/components/wizard-step-additional-contacts/wizard-step-additional-contacts.component';
import { WizardSummaryComponent } from './components/tbr-workflow/components/wizard-summary/wizard-summary.component';

setTheme('sap_belize');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    TbrListComponent,
    TbrDetailsComponent,
    TbrEmptyStateComponent,
    TbrTypePipe,
    AddressPipe,
    ConsignorTextPipe,
    ThuAmountPipe,
    ParseDatePipe,
    TbrNetworkComponent,
    ShipitStatusPipe,
    ThuDetailsComponent,
    TbrNetworkFormComponent,
    InputComponent,
    TimepickerComponent,
    DatepickerComponent,
    DialogComponent,
    CheckboxComponent,
    SelectComponent,
    TbrWorkflowComponent,
    WizardStepPickupInfoComponent,
    WizardStepTransportTypeComponent,
    WizardStepContactComponent,
    WizardStepCostOwnerComponent,
    WizardStepReasonCodeComponent,
    WizardStepNoteComponent,
    WizardStepAdditionalContactsComponent,
    WizardSummaryComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot([]),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
      autoPause: true,
    }),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    StateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
