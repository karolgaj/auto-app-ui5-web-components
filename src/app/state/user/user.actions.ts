import { createAction, props } from '@ngrx/store';
import { UserData } from '../../models/user.model';

export const loadUserData = createAction('[User] Load User');

export const loadUserDataSuccess = createAction('[User] Load User Data Success', props<{ data: UserData }>());

export const loadUserDataFailure = createAction('[User] Load User Data Failure', props<{ error: any }>());
