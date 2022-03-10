import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as TbrActions from './tbr.actions';
import { TbrService } from '../services/tbr.service';
import { Router } from '@angular/router';

@Injectable()
export class TbrEffects {
  loadTbrs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.loadTbrs),
      concatMap(() =>
        this.tbrService.getTbrList().pipe(
          map((data) => TbrActions.loadTbrsSuccess({ data })),
          catchError((error) => of(TbrActions.loadTbrsFailure({ error })))
        )
      )
    );
  });

  selectTbr$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TbrActions.selectTbr),
      tap((data) => console.log(data.data)),
      exhaustMap(({ data }) =>
        this.tbrService.getTbrDetails(data).pipe(
          map((data) => TbrActions.selectTbrSuccess({ data })),
          catchError((error) => of(TbrActions.selectTbrFailure({ error })))
        )
      )
    );
  });

  selectTbrSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TbrActions.selectTbrSuccess),
        tap(({ data }) => {
          this.router.navigate([data.shipitId]);
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private tbrService: TbrService, private router: Router) {}
}
