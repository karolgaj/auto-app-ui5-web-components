import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { TbrNetwork } from '../models/tbr-network.model';
// @ts-ignore
import * as tbrNetworks from './mocks/tbr-network.mock-data.json';

@Injectable({ providedIn: 'root' })
export class TbrService {
  constructor(private http: HttpClient) {}

  getTbrNetworks(): Observable<TbrNetwork[]> {
    return of(tbrNetworks.default as TbrNetwork[]);
  }

  getConsignors() {
    return of([
      {
        info: 'some info',
        parma: '1234',
        name: 'VOLVO',
      },
      {
        info: 'some info',
        parma: '1234',
        name: 'VOLVO',
      },
    ]);
  }

  getShipItems() {
    return of([
      {
        info: 'ship item 1',
        parma: 'ship parma 1',
        name: 'Name1',
      },
      {
        info: 'ship item 2',
        parma: 'ship Parma 2',
        name: 'Name2',
      },
    ]);
  }

  createTbr(data: any) {
    return of(data);
  }
}
