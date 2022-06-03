import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as NetworkFormActions from './network-form.actions';
import { XtrService } from '../../services/xtr.service';
import { TransportNetworkService } from '../../services/transport-network.service';
import { goToWorkflowSuccess } from '../tbr';

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

  loadConsignees$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetworkFormActions.loadConsignees),
      concatMap(({ data }) =>
        this.xtrService.getListOfConsignees(data).pipe(
          map((res) => NetworkFormActions.loadConsigneesSuccess({ data: res })),
          catchError((error) => of(NetworkFormActions.loadConsigneesFailure({ error })))
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

  updateNetwork$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkFormActions.updateNetwork),
      concatMap(({ data, shipitId }) =>
        this.networkService.patchNetwork(shipitId, data).pipe(
          switchMap(() => from([NetworkFormActions.updateNetworkSuccess({ shipitId }), goToWorkflowSuccess({ data: shipitId })])),
          catchError((error) => of(NetworkFormActions.updateNetworkFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private xtrService: XtrService,
    private networkService: TransportNetworkService,
    private router: Router
  ) {}
}
