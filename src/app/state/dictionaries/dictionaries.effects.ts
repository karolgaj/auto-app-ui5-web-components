import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as DictionariesActions from './dictionaries.actions';
import { DictionariesService } from '../../services/dictionaries.service';

@Injectable()
export class DictionariesEffects {
  loadReasonCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionariesActions.loadReasonCodes),
      concatMap(() =>
        this.dictionariesService.reasonCodes().pipe(
          map((data) => DictionariesActions.loadReasonCodesSuccess({ data })),
          catchError((error: unknown) => of(DictionariesActions.loadReasonCodesFailure({ error })))
        )
      )
    )
  );

  loadHazmatClasses = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionariesActions.loadHazmatClasses),
      concatMap(() =>
        this.dictionariesService.hazmatCodes().pipe(
          map((data) => DictionariesActions.loadHazmatClassesSuccess({ data })),
          catchError((error: unknown) => of(DictionariesActions.loadHazmatClassesFailure({ error })))
        )
      )
    )
  );

  loadCountryCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DictionariesActions.loadCountryList),
      concatMap(() =>
        this.dictionariesService.countryList().pipe(
          map((data) => DictionariesActions.loadCountryListSuccess({ data })),
          catchError((error: unknown) => of(DictionariesActions.loadCountryListFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private dictionariesService: DictionariesService) {}
}
