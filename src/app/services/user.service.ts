import { Injectable } from '@angular/core';
import { UserData } from '../models/user.model';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserDate(): Observable<UserData> {
    return this.http.get<UserData>('/gateway/api/user/v1/me');
  }
}
