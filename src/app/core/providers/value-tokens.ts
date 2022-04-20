import { InjectionToken, ValueProvider } from '@angular/core';
import { environment } from '../../../environments/environment';

export const HTTP_BASE_URL = new InjectionToken<string>('HTTP_BASE_URL');
const HTTP_BASE_URL_VALUE: string = environment.baseUrl;

export const TOKEN_KEY = new InjectionToken<string>('TOKEN_KEY');
const TOKEN_KEY_VALUE = 'access_token';

export const TOKENS: ValueProvider[] = [
  {
    provide: HTTP_BASE_URL,
    useValue: HTTP_BASE_URL_VALUE,
  },
  {
    provide: TOKEN_KEY,
    useValue: TOKEN_KEY_VALUE,
  },
];
