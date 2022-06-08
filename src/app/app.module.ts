import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// @ts-ignore
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';
// @ts-ignore
import { setLanguage } from '@ui5/webcomponents-base/dist/config/Language';

import { StateModule } from './state/state.module';

import { PIPES } from './pipes';
import { LayoutComponent, UI_COMPONENTS } from './ui';
import { COMPONENTS } from './components';
import { SharedModule } from './shared';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { BASE_URL } from './core/providers/value-tokens';
import { ErrorMessagePipe } from './pipes/error-message.pipe';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
setTheme('sap_belize');
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
setLanguage('en');

export function createTranslateLoader(http: HttpClient, baseUrl: string) {
  return new TranslateHttpLoader(http, `${baseUrl}assets/i18n/`, '.json');
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent, ...PIPES, ...UI_COMPONENTS, ...COMPONENTS, LayoutComponent, ErrorMessagePipe],
  imports: [
    BrowserModule,
    CommonModule,
    CoreModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        deps: [HttpClient, BASE_URL],
        useFactory: createTranslateLoader,
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
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
