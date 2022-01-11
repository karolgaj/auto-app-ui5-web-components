import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import '@ui5/webcomponents/dist/Button';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/Table.js';
import '@ui5/webcomponents/dist/TableColumn.js';
import '@ui5/webcomponents/dist/TableRow.js';
import '@ui5/webcomponents/dist/TableCell.js';
import '@ui5/webcomponents/dist/Avatar';
import '@ui5/webcomponents/dist/Panel';
import '@ui5/webcomponents/dist/Input.js';

import '@ui5/webcomponents-fiori/dist/Bar';
import '@ui5/webcomponents-fiori/dist/ShellBar';
import '@ui5/webcomponents-fiori/dist/illustrations/NoData.js';
import '@ui5/webcomponents-fiori/dist/IllustratedMessage.js';

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

setTheme('sap_belize');

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
  ],
  imports: [BrowserModule, CommonModule, AppRoutingModule, FlexLayoutModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
