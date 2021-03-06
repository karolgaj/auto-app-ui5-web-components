import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTOR_PROVIDERS } from './providers';
import { TOKENS } from './providers/value-tokens';
import { AuthProvider } from './providers/auth.provider';
import { LoadDictionariesProvider } from './providers/load-dictionaries.provider';

@NgModule({
  providers: [AuthProvider, LoadDictionariesProvider, ...HTTP_INTERCEPTOR_PROVIDERS, ...TOKENS],
})
export class CoreModule {}
