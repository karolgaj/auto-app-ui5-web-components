import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services';
import { HTTP_BASE_URL } from './value-tokens';

@Injectable()
export class UnauthorizedErrorInterceptor implements HttpInterceptor {
  constructor(@Inject(HTTP_BASE_URL) private baseUrl: string, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (request.url.includes(this.baseUrl) && error.status === 401) {
          void this.authService.login();
        }
        return throwError(error.error);
      })
    );
  }
}
