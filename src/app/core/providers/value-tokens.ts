import { FactoryProvider, InjectionToken, ValueProvider } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../window.provider';

interface EnvConfig {
  baseUrl: string;
  pingUrl: string;
  pingRedirectUrl: string;
  clientId: string;
  production: boolean;
}

export const ENVIRONMENT = new InjectionToken('ENVIRONMENT');
function getEnvironment(window: Window): EnvConfig {
  const { host } = window.location;
  const options = {
    pingUrl: 'https://federate-qa.volvo.com',
    pingRedirectUrl: 'https://shipitapi-qa.volvogroup.com',
    clientId: 'shipit',
    production: false,
  };

  switch (host) {
    case 'localhost:4200':
      return {
        ...options,
        baseUrl: 'https://shipitapi-dev.volvogroup.com/apigw',
        pingRedirectUrl: 'https://localhost:4200',
      };
    case 'shipitapi-dev.volvogroup.com':
      return {
        ...options,
        baseUrl: 'https://shipitapi-dev.volvogroup.com/apigw',
        pingRedirectUrl: 'https://shipitapi-dev.volvogroup.com',
      };
    case 'shipitapi-test.volvogroup.com':
      return {
        ...options,
        baseUrl: 'https://shipitapi-test.volvogroup.com/apigw',
        pingRedirectUrl: 'https://shipitapi-test.volvogroup.com',
      };
    case 'shipitapi-qa.volvogroup.com':
      return {
        ...options,
        baseUrl: 'https://shipitapi-qa.volvogroup.com/apigw',
        pingRedirectUrl: 'https://shipitapi-qa.volvogroup.com',
      };
    case 'shipitapi.volvogroup.com':
      return {
        ...options,
        baseUrl: 'https://shipitapi.volvogroup.com/apigw',
        pingUrl: 'https://federate.volvo.com',
        pingRedirectUrl: 'https://shipitapi.volvogroup.com',
      };
    default:
      throw new Error(`unexpected host: ${host}`);
  }
}

export const HTTP_BASE_URL = new InjectionToken<string>('HTTP_BASE_URL');

export const BASE_URL = new InjectionToken<string>('BASE_URL');
function baseUrl(document: Document) {
  return document.getElementsByTagName('base')[0].href;
}

export const PING_URL = new InjectionToken<string>('PING_URL');

export const PING_REDIRECT_URL = new InjectionToken<string>('PING_URL');

export const CLIENT_ID = new InjectionToken<string>('CLIENT_ID');

export const TOKEN_KEY = new InjectionToken<string>('TOKEN_KEY');
const TOKEN_KEY_VALUE = 'access_token';

export const REFRESH_TOKEN_KEY = new InjectionToken<string>('REFRESH_TOKEN_KEY');
const REFRESH_TOKEN_KEY_VALUE = 'refresh_token';

export const GOOGLE_API_KEY = new InjectionToken<string>('GOOGLE_API_KEY');
export const GOOGLE_API_KEY_VALUE = 'AIzaSyCWjZ8OxZGd5-nXc1krnsQGdG2D8kzz9x0';

export const GOOGLE_API_URL = new InjectionToken<string>('GOOGLE_API_URL');
export const GOOGLE_API_URL_VALUE = 'https://maps.googleapis.com/maps/api';

export const TOKENS: (ValueProvider | FactoryProvider)[] = [
  {
    provide: ENVIRONMENT,
    deps: [WINDOW],
    useFactory: getEnvironment,
  },
  {
    provide: HTTP_BASE_URL,
    deps: [ENVIRONMENT],
    useFactory: (env: EnvConfig) => env.baseUrl,
  },
  {
    provide: PING_URL,
    deps: [ENVIRONMENT],
    useFactory: (env: EnvConfig) => env.pingUrl,
  },
  {
    provide: PING_REDIRECT_URL,
    deps: [ENVIRONMENT],
    useFactory: (env: EnvConfig) => env.pingRedirectUrl,
  },
  {
    provide: CLIENT_ID,
    deps: [ENVIRONMENT],
    useFactory: (env: EnvConfig) => env.clientId,
  },
  {
    provide: TOKEN_KEY,
    useValue: TOKEN_KEY_VALUE,
  },
  {
    provide: REFRESH_TOKEN_KEY,
    useValue: REFRESH_TOKEN_KEY_VALUE,
  },
  {
    provide: GOOGLE_API_KEY,
    useValue: GOOGLE_API_KEY_VALUE,
  },
  {
    provide: GOOGLE_API_URL,
    useValue: GOOGLE_API_URL_VALUE,
  },
  {
    provide: BASE_URL,
    deps: [DOCUMENT],
    useFactory: baseUrl,
  },
];
