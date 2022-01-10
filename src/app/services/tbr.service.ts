import { Injectable } from '@angular/core';
// @ts-ignore
import * as tbrList from './tbr-list.mock-data.json';
import { of } from 'rxjs';

const data = tbrList;
@Injectable({ providedIn: 'root' })
export class TbrService {
  constructor() {}

  getTbrs(): any {
    return of(data.details);
  }
}
