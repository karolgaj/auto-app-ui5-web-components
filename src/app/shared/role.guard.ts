import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserRole } from '../models/user.model';
import { Store } from '@ngrx/store';
import { selectUserData } from '../state';
import { filter, map } from 'rxjs/operators';

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
          return this.router.createUrlTree(['']);
        }
        return requiredRoles.some((r) => user?.roles.includes(r));
      })
    );
  }
}
