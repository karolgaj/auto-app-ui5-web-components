import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE } from '../local-storage.provider';
import { HTTP_BASE_URL } from './value-tokens';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(@Inject(LOCAL_STORAGE) private localStorage: Storage, @Inject(HTTP_BASE_URL) private baseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.localStorage.getItem('access_token');
    if (token && request.url.includes(this.baseUrl)) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });

      return next.handle(cloned);
    }

    return next.handle(request);
  }
}
