import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_BASE_URL } from './value-tokens';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(@Inject(HTTP_BASE_URL) private baseUrl: string) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const apiReq = request.clone({ url: request.url.replace('/gateway', this.baseUrl) });
    return next.handle(apiReq);
  }
}
