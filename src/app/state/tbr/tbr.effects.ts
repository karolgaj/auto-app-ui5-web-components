import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, exhaustMap, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as TbrActions from './tbr.actions';
import { selectTbr } from './tbr.actions';
import { TbrService } from '../../services';
import { XtrService } from '../../services/xtr.service';
import { TransportNetworkService } from '../../services/transport-network.service';
import { PackItService } from '../../services/packit.service';
import { selectedTbr } from './tbr.selectors';
import { Tbr } from '../../models/tbr.model';

@Injectable()
export class TbrEffects {
  loadTbrs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadTbrs, TbrActions.refreshTbrList),
      concatMap(() => {
        return this.xtrService.getXtrs().pipe(
          switchMap((res) => from([TbrActions.loadTbrsSuccess({ data: res })])),
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
      exhaustMap(({ data, redirect }) => {
        const shipItId = data as string;
        return this.xtrService.getXtrByShipItId(shipItId).pipe(
          map((res) => TbrActions.selectTbrSuccess({ data: res, redirect })),
          catchError((error: unknown) => of(TbrActions.selectTbrFailure({ error })))
        );
      })
    );
  });

  updateTbr = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.updateTbr),
      withLatestFrom(this.store.select(selectedTbr)),
      concatMap(([{ data }, tbr]) => {
        return this.xtrService
          .saveXTR({
            ...(tbr as Tbr),
            ...data,
          })
          .pipe(
            map((res) => TbrActions.updateTbrSuccess({ data: res })),
            catchError((error: unknown) => of(TbrActions.updateTbrFailure({ error })))
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
      map(({ data }) => selectTbr({ data: data.shipitId, redirect: true }))
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

  goToWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.goToWorkflow),
      withLatestFrom(this.store.select(selectedTbr)),
      concatMap(([{ data }, tbr]) => {
        if (tbr == null) {
          return EMPTY;
        }
        const updatedTbr: Tbr = {
          ...tbr,
          shipitStatus: data.status,
          deliveryDate: data.deliveryDate,
        };
        return this.xtrService.saveXTR(updatedTbr).pipe(map((res) => TbrActions.goToWorkflowSuccess({ data: res })));
      })
    )
  );

  goToWorkflowSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TbrActions.goToWorkflowSuccess),
        tap(({ data }) => {
          this.router.navigate(['/', 'xtr', 'workflow', data.shipitId]);
        })
      ),
    {
      dispatch: false,
    }
  );

  goToWorkflowSummary$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TbrActions.goToWorkflowSummary),
        tap(({ data }) => {
          if (data) {
            this.router.navigate(['/', 'xtr', 'workflow', data.shipitId, 'summary']);
          }
        })
      ),
    {
      dispatch: false,
    }
  );

  finishWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.finishWorkflow),
      withLatestFrom(this.store.select(selectedTbr)),
      concatMap(([{ data }, tbr]) => {
        if (tbr) {
          return this.xtrService.saveXTR({ ...tbr, ...data }).pipe(
            map((res) => {
              return TbrActions.finishWorkflowSuccess({ data: res });
            }),
            catchError((error: unknown) => of(TbrActions.finishWorkflowFailure({ error })))
          );
        }
        return EMPTY;
      })
    )
  );

  finishWorkflowSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TbrActions.finishWorkflowSuccess),
      map(({ data }) => {
        return TbrActions.goToWorkflowSummary({ data });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private tbrService: TbrService,
    private xtrService: XtrService,
    private packItService: PackItService,
    private transportNetworkService: TransportNetworkService,
    private router: Router
  ) {}
}
