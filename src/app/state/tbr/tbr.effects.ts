import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as TbrActions from './tbr.actions';
import { selectTbr } from './tbr.actions';
import { TbrService } from '../../services';
import { Store } from '@ngrx/store';
import { XtrService } from '../../services/xtr.service';

@Injectable()
export class TbrEffects {
  loadTbrs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadTbrs, TbrActions.refreshTbrList),
      concatMap(({ data }) => {
        return this.xtrService.getXtrs().pipe(
          map((data) => TbrActions.loadTbrsSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadTbrsFailure({ error })))
        );
      })
    );
  });

  loadNetworks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadAvailableNetworks),
      concatMap(({ data }) =>
        this.tbrService.getTbrNetworks().pipe(
          map((data) => TbrActions.loadAvailableNetworksSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadAvailableNetworksFailure({ error })))
        )
      )
    );
  });

  loadReasonCodes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadReasonCodes),
      concatMap(() =>
        this.xtrService.reasonCodes().pipe(
          map((data) => TbrActions.loadReasonCodesSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadReasonCodesFailure({ error })))
        )
      )
    );
  });

  loadConsignors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadConsignors),
      concatMap(({ data }) =>
        this.tbrService.getConsignors().pipe(
          map((data) => TbrActions.loadConsignorsSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadConsignorsFailure({ error })))
        )
      )
    );
  });

  loadShipItems$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadShipItems),
      concatMap(() =>
        this.tbrService.getShipItems().pipe(
          map((data) => TbrActions.loadShipItemsSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadShipItemsFailure({ error })))
        )
      )
    );
  });

  loadUnloadingPoints$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadUnloadingPoints),
      concatMap(({ data }) =>
        this.tbrService.getUnloadingPoints(data).pipe(
          map((data) => TbrActions.loadUnloadingPointsSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.loadUnloadingPointsFailure({ error })))
        )
      )
    );
  });

  selectTbr$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.selectTbr),
      tap((data) => console.log(data.data)),
      exhaustMap(({ data }) =>
        this.xtrService.getXtrByShipItId(data).pipe(
          map((data) => TbrActions.selectTbrSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.selectTbrFailure({ error })))
        )
      )
    );
  });

  selectTbrSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TbrActions.selectTbrSuccess),
        tap(({ data }) => {
          void this.router.navigate(['/', 'xtr', data.shipitId]);
        })
      );
    },
    { dispatch: false }
  );

  createTbr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.createTbr),
      concatMap(({ data }) =>
        this.tbrService.createTbr(data).pipe(
          map((data) => TbrActions.createTbrSuccess({ data })),
          catchError((error: unknown) => of(TbrActions.createTbrFailure({ error })))
        )
      )
    )
  );

  createTbrSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.createTbrSuccess),
      map(({ data }) => selectTbr({ data: data.shipitId }))
    )
  );

  updateReference$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.updateReference),
      concatMap(({ data }) =>
        this.xtrService.updateReference(data.shipitId, data.pickupRef, data.msgToCarrier).pipe(
          map((data) => TbrActions.updateReferenceSuccess(data)),
          catchError((error: unknown) => of(TbrActions.updateReferenceFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private tbrService: TbrService,
    private xtrService: XtrService,
    private router: Router,
    private store: Store
  ) {}
}
