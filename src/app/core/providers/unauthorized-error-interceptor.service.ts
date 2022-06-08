import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { concatMap, Observable, retry } from 'rxjs';
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
      retry({
        count: 1,
        delay: (errors) => {
          return errors.pipe(
            concatMap((error: HttpErrorResponse, count) => {
              if (count <= retryCount && error.status === 401) {
                return this.reAuthenticate().pipe(switchMap(() => next.handle(request)));
              }
              throw error;
            })
          );
        },
      })
    );
  }

  reAuthenticate(): Observable<{ access_token: string; refresh_token: string }> {
    return this.authService.refreshToken();
  }
}
