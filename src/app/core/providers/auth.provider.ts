import { APP_INITIALIZER, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { REFRESH_TOKEN_KEY } from './value-tokens';
import { LOCAL_STORAGE } from '../local-storage.provider';
import { AuthService } from '../../services';
import { loadUserData } from '../../state';

const codeRegExp = /[?&]code=([^&]*)/;

export const AuthProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [Store, Router, Location, AuthService, LOCAL_STORAGE, REFRESH_TOKEN_KEY, HttpClient],
  useFactory:
    (store: Store, router: Router, location: Location, authService: AuthService, localStorage: Storage, refreshTokenKey: string) => () => {
      if (location.path().includes('health')) {
        return;
      }

      if (location.path().includes('code')) {
        const data = codeRegExp.exec(location.path());
        const code = data ? decodeURIComponent(data[1]) : null;
        if (code) {
          authService.getToken(code).subscribe(() => {
            store.dispatch(loadUserData());
            router.navigate(['/']);
          });
        }
        return;
      }

      const refreshToken = localStorage.getItem(refreshTokenKey);
      if (refreshToken) {
        authService.refreshToken().subscribe(() => {
          store.dispatch(loadUserData());
        });
        return;
      }

      authService.login().then(() => store.dispatch(loadUserData()));
    },
};
