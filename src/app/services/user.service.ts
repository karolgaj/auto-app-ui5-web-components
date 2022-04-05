import { Injectable } from '@angular/core';
import { UserData } from '../models/user.model';

// @ts-ignore
import * as data from './mocks/user.mock-data.json';
import { Observable, of } from 'rxjs';

const userData: UserData = data;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getUserDate(): Observable<UserData> {
    return of(userData);
  }
}
