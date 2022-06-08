import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { concatMap, Observable, retryWhen, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { HTTP_BASE_URL } from './value-tokens';

export const retryCount = 1;
export const retryWaitMilliSeconds = 1000;

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(HTTP_BASE_URL) private baseUrl: string, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((errors) => {
        return errors.pipe(
          concatMap((error, count) => {
            if (count <= retryCount && error.status === 401) {
              return this.reAuthenticate().pipe(switchMap(() => next.handle(request)));
            }
            return throwError(error);
          })
        );
      })
    );
  }

  reAuthenticate(): Observable<{ access_token: string; refresh_token: string }> {
    return this.authService.refreshToken();
  }
}
