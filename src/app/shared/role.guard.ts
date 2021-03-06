import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UserRole } from '../models/user.model';
import { selectUserData } from '../state';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data.roles as UserRole[];
    if (requiredRoles == null || requiredRoles.length === 0) {
      throw new Error('No chosen roles for RoleGuard');
    }

    return this.store.select(selectUserData).pipe(
      filter((value) => value != null),
      map((user) => {
        if (route.url.length === 0 && user?.roles.length === 1) {
          return this.router.createUrlTree(['xtr']);
        }
        return requiredRoles.some((r) => user?.roles.includes(r));
      })
    );
  }
}
