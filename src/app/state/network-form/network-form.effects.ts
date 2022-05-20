import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as NetworkFormActions from './network-form.actions';
import { XtrService } from '../../services/xtr.service';

@Injectable()
export class NetworkFormEffects {
  createEmptyBooking$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.createEmptyBooking),
      concatMap(() => {
        if (this.router.url === '/xtr/network') {
          return EMPTY;
        }
        return this.xtrService.createEmptyBooking().pipe(
          map((data) => NetworkFormActions.createEmptyBookingSuccess({ data })),
          catchError((error) => of(NetworkFormActions.createEmptyBookingFailure({ error })))
        );
      })
    );
  });

  createEmptyBookingSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(NetworkFormActions.createEmptyBookingSuccess),
        tap(() => this.router.navigate(['/', 'xtr', 'network']))
      );
    },
    { dispatch: false }
  );

  loadListOfShipFrom$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.loadShipFrom),
      concatMap(() =>
        this.xtrService.getListOfShipFrom().pipe(
          map((data) => NetworkFormActions.loadShipFromSuccess({ data })),
          catchError((error) => of(NetworkFormActions.loadShipFromFailure({ error })))
        )
      )
    );
  });

  loadListOfShipTo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.loadShipTo),
      concatMap(() =>
        this.xtrService.getListOfShipTo().pipe(
          map((data) => NetworkFormActions.loadShipToSuccess({ data })),
          catchError((error) => of(NetworkFormActions.loadShipToFailure({ error })))
        )
      )
    );
  });

  loadConsignors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.loadConsignors),
      concatMap(() =>
        this.xtrService.getListOfConsignors().pipe(
          map((data) => NetworkFormActions.loadConsignorsSuccess({ data })),
          catchError((error) => of(NetworkFormActions.loadConsignorsFailure({ error })))
        )
      )
    );
  });

  loadUnloadPoint$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.loadUnloadingPoint),
      concatMap(({ data }) =>
        this.xtrService.getListOfUnloadingPoints(data).pipe(
          map((res) => NetworkFormActions.loadUnloadingPointSuccess({ data: res })),
          catchError((error) => of(NetworkFormActions.loadUnloadingPointFailure({ error })))
        )
      )
    );
  });

  constructor(private actions$: Actions, private xtrService: XtrService, private router: Router) {}
}
