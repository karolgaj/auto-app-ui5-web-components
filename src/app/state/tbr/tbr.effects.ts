import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import * as TbrActions from './tbr.actions';
import { selectTbr } from './tbr.actions';
import { TbrService } from '../../services';
import { XtrService } from '../../services/xtr.service';
import { TransportNetworkService } from '../../services/transport-network.service';
import { PackItService } from '../../services/packit.service';

@Injectable()
export class TbrEffects {
  loadTbrs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadTbrs, TbrActions.refreshTbrList),
      concatMap(() => {
        return this.xtrService.getXtrs().pipe(
          switchMap((res) => from([TbrActions.loadTbrsSuccess({ data: res }), TbrActions.refreshTbrListSuccess()])),
          catchError((error: unknown) => of(TbrActions.loadTbrsFailure({ error })))
        );
      })
    );
  });

  refreshTbrsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.refreshTbrListSuccess),
      map(() => TbrActions.selectTbr({ data: null }))
    );
  });

  loadNetworks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadAvailableNetworks),
      concatMap(({ data }) =>
        this.tbrService.getTbrNetworks().pipe(
          map((res) => TbrActions.loadAvailableNetworksSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.loadAvailableNetworksFailure({ error })))
        )
      )
    );
  });

  loadConsignors$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadConsignors),
      concatMap(({ data }) =>
        this.tbrService.getConsignors().pipe(
          map((res) => TbrActions.loadConsignorsSuccess({ data: res })),
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

  loadShipPoints$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadShipPoints),
      concatMap(({ data }) =>
        this.transportNetworkService.getActiveShipPointByParma(data).pipe(
          map((res) => TbrActions.loadShipPointsSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.loadShipPointsFailure({ error })))
        )
      )
    );
  });

  loadUnloadingPoints$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadUnloadingPoints),
      concatMap(({ data }) =>
        this.transportNetworkService.getUnloadingPoints(data.consignor, data.shipFrom).pipe(
          map((res) => TbrActions.loadUnloadingPointsSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.loadUnloadingPointsFailure({ error })))
        )
      )
    );
  });

  selectTbr$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.selectTbr),
      filter((data) => data.data != null),
      exhaustMap(({ data }) => {
        const shipItId = data as string;
        return this.xtrService.getXtrByShipItId(shipItId).pipe(
          map((res) => TbrActions.selectTbrSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.selectTbrFailure({ error })))
        );
      })
    );
  });

  resetSelectedValue$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TbrActions.selectTbr),
        filter((data) => data.data == null),
        tap(() => {
          this.router.navigate(['/', 'xtr']);
        })
      );
    },
    { dispatch: false }
  );

  selectTbrSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.selectTbrSuccess),
      switchMap(({ data }) => {
        this.router.navigate(['/', 'xtr', data.shipitId]);
        return of(TbrActions.loadThuList({ data: data.shipFrom.parma }));
      })
    );
  });

  loadTHUList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadThuList),
      concatMap(({ data }) =>
        this.packItService.getTHUListByShipFrom(data).pipe(
          map((res) => TbrActions.loadThuListSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.loadThuListFailure({ error })))
        )
      )
    );
  });

  createTbr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.createTbr),
      concatMap(({ data }) =>
        this.tbrService.createTbr(data).pipe(
          map((res) => TbrActions.createTbrSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.createTbrFailure({ error })))
        )
      )
    )
  );

  addLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.addLine),
      concatMap(({ data }) =>
        this.xtrService.addLine(data.shipItId, data.poNumber, data.partNo, data.plannedQty).pipe(
          map((res) => TbrActions.addLineSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.addLineFailure({ error })))
        )
      )
    )
  );

  splitLine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.splitLine),
      concatMap(({ data }) =>
        this.xtrService.splitLine(data.shipItId, data.releaseLines).pipe(
          map((res) => TbrActions.splitLineSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.splitLineFailure({ error })))
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
          map((res) => TbrActions.updateReferenceSuccess({ data: res })),
          catchError((error: unknown) => of(TbrActions.updateReferenceFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private tbrService: TbrService,
    private xtrService: XtrService,
    private packItService: PackItService,
    private transportNetworkService: TransportNetworkService,
    private router: Router
  ) {}
}
