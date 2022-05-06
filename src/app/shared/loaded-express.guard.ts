import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectedTbr, selectTbr } from '../state';

@Injectable({
  providedIn: 'root',
})
export class LoadedExpressGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const shipItId = route.paramMap.get('shipItId');
    return this.store.select(selectedTbr).pipe(
      tap((value) => {
        if (value == null || value.shipitId !== shipItId) {
          this.store.dispatch(selectTbr({ data: shipItId }));
        }
      }),
      map((value) => !(value == null || value.shipitId !== shipItId))
    );
  }
}
