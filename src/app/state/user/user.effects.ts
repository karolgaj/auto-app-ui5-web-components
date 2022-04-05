import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

import * as UserActions from './user.actions';
import { UserService } from '../../services';

@Injectable()
export class UserEffects {
  loadUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loadUserData),
      concatMap(() =>
        this.userService.getUserDate().pipe(
          map((data) => UserActions.loadUserDataSuccess({ data })),
          catchError((error) => of(UserActions.loadUserDataFailure({ error })))
        )
      )
    );
  });

  constructor(private actions$: Actions, private userService: UserService) {}
}
