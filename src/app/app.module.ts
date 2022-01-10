import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import '@ui5/webcomponents/dist/Button';
import '@ui5/webcomponents/dist/Label';
import '@ui5/webcomponents/dist/Table.js';
import '@ui5/webcomponents/dist/TableColumn.js';
import '@ui5/webcomponents/dist/TableRow.js';
import '@ui5/webcomponents/dist/TableCell.js';
import '@ui5/webcomponents/dist/Avatar';

import '@ui5/webcomponents-fiori/dist/Bar';
import '@ui5/webcomponents-fiori/dist/ShellBar';

import '@ui5/webcomponents-icons/dist/AllIcons.js';

import '@ui5/webcomponents/dist/Assets';
import '@ui5/webcomponents-fiori/dist/Assets';
// @ts-ignore
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
import { TbrListComponent } from './components/tbr-list/tbr-list.component';
import { TbrDetailsComponent } from './components/tbr-details/tbr-details.component';
import { TbrEmptyStateComponent } from './components/tbr-empty-state/tbr-empty-state.component';

setTheme('sap_belize');

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent, TbrListComponent, TbrDetailsComponent, TbrEmptyStateComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
