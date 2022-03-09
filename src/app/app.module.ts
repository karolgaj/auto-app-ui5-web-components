import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import '@ui5/webcomponents/dist/Button';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/Table';
import '@ui5/webcomponents/dist/TableColumn';
import '@ui5/webcomponents/dist/TableRow';
import '@ui5/webcomponents/dist/TableCell';
import '@ui5/webcomponents/dist/Avatar';
import '@ui5/webcomponents/dist/Panel';
import '@ui5/webcomponents/dist/Input';
import '@ui5/webcomponents/dist/features/InputSuggestions';
import '@ui5/webcomponents/dist/DatePicker';
import '@ui5/webcomponents/dist/Switch';
import '@ui5/webcomponents/dist/Dialog';

import '@ui5/webcomponents-fiori/dist/Bar';
import '@ui5/webcomponents-fiori/dist/ShellBar';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData';
import '@ui5/webcomponents-fiori/dist/IllustratedMessage';

import '@ui5/webcomponents-icons/dist/AllIcons.js';

import '@ui5/webcomponents/dist/Assets';
import '@ui5/webcomponents-fiori/dist/Assets';
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
import { DatepickerComponent, InputComponent } from './ui/input';
import { DialogComponent } from './ui/dialog/dialog.component';

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
    DatepickerComponent,
    DialogComponent,
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
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !environment.production,
      autoPause: true,
    }),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
