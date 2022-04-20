import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../state';

@Injectable({
  providedIn: 'root',
})
export class IsNotAuthenticatedGuard implements CanActivate {
  private canActivate$ = this.store
    .select(selectIsAuthenticated)
    .pipe(map((value) => (value ? this.router.createUrlTree(['xtr']) : !value)));
  constructor(private router: Router, private store: Store) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate$;
  }
}
