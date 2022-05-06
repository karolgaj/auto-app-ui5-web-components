import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../state';
import { WINDOW } from '../core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate, CanActivateChild {
  private canActivate$ = this.store
    .select(selectIsAuthenticated)
    .pipe(map((value) => value || this.router.createUrlTree([this.window.location.pathname])));

  constructor(private router: Router, private store: Store, @Inject(WINDOW) private window: Window) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate$;
  }

  canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate$;
  }
}
