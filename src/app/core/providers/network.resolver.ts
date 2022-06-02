import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import { createEmptyBooking, selectNewBooking } from '../../state/network-form';
import { Tbr } from '../../models/tbr.model';

@Injectable({
  providedIn: 'root',
})
export class NetworkResolver implements Resolve<Partial<Tbr>> {
  constructor(private store: Store) {}

  resolve(): Observable<Partial<Tbr>> {
    return this.store.select(selectNewBooking).pipe(
      tap((value) => {
        if (!value) {
          this.store.dispatch(createEmptyBooking());
        }
      }),
      filter(Boolean),
      take(1)
    );
  }
}
