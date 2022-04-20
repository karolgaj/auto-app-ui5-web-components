import { APP_INITIALIZER, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jose from 'jose';
import { TOKEN_KEY } from './value-tokens';
import { LOCAL_STORAGE } from '../local-storage.provider';
import { DateTime } from 'luxon';
import { AuthService } from '../../services';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadUserData } from '../../state';

const codeRegExp = new RegExp(`[?&]code=([^&]*)`);

export const AuthProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [Store, Router, Location, AuthService, LOCAL_STORAGE, TOKEN_KEY, HttpClient],
  useFactory:
    (store: Store, router: Router, location: Location, authService: AuthService, localStorage: Storage, tokenKey: string) => () => {
      if (location.path().includes('code')) {
        const data = codeRegExp.exec(location.path());
        const code = data ? decodeURIComponent(data[1]) : null;
        if (code) {
          authService.getToken(code).subscribe((data) => {
            localStorage.setItem(tokenKey, data.access_token);
            store.dispatch(loadUserData());
            void router.navigate(['']);
          });
        }
        return;
      }
      const accessToken = localStorage.getItem(tokenKey);
      if (accessToken) {
        const decodedJwt = jose.decodeJwt(accessToken);
        const expirationDate = decodedJwt.exp ? decodedJwt.exp * 1000 : 0;

        if (DateTime.now() > DateTime.fromMillis(expirationDate)) {
          void authService.login();
        }
        store.dispatch(loadUserData());
        return;
      }

      void authService.login();
    },
};
