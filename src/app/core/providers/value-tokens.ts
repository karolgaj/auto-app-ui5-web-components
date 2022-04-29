import { InjectionToken, ValueProvider } from '@angular/core';
import { environment } from '../../../environments/environment';

export const HTTP_BASE_URL = new InjectionToken<string>('HTTP_BASE_URL');
const HTTP_BASE_URL_VALUE: string = environment.baseUrl;

export const PING_URL = new InjectionToken<string>('PING_URL');
const PING_URL_VALUE: string = environment.pingUrl;

export const PING_REDIRECT_URL = new InjectionToken<string>('PING_URL');
const PING_REDIRECT_URL_VALUE: string = environment.pingRedirectUrl;

export const CLIENT_ID = new InjectionToken<string>('CLIENT_ID');
const CLIENT_ID_VALUE: string = environment.clientId;

export const TOKEN_KEY = new InjectionToken<string>('TOKEN_KEY');
const TOKEN_KEY_VALUE = 'access_token';

export const REFRESH_TOKEN_KEY = new InjectionToken<string>('REFRESH_TOKEN_KEY');
const REFRESH_TOKEN_KEY_VALUE = 'refresh_token';

export const TOKENS: ValueProvider[] = [
  {
    provide: HTTP_BASE_URL,
    useValue: HTTP_BASE_URL_VALUE,
  },
  {
    provide: PING_URL,
    useValue: PING_URL_VALUE,
  },
  {
    provide: PING_REDIRECT_URL,
    useValue: PING_REDIRECT_URL_VALUE,
  },
  {
    provide: CLIENT_ID,
    useValue: CLIENT_ID_VALUE,
  },
  {
    provide: TOKEN_KEY,
    useValue: TOKEN_KEY_VALUE,
  },
  {
    provide: REFRESH_TOKEN_KEY,
    useValue: REFRESH_TOKEN_KEY_VALUE,
  },
];
