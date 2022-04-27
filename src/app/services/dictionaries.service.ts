import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountryCode } from '../models/country-code.model';
import { ReasonCodesDetails } from '../models/reason-code.model';
import { HazmatClass } from '../models/hazmat-class.model';

@Injectable({
  providedIn: 'root',
})
export class DictionariesService {
  constructor(private http: HttpClient) {}

  /* GET METHODS */

  countryList(): Observable<CountryCode[]> {
    return this.http.get<CountryCode[]>('/gateway/api/xtr/v1/country');
  }

  reasonCodes(): Observable<ReasonCodesDetails[]> {
    return this.http.get<ReasonCodesDetails[]>('/gateway/api/xtr/v1/reasoncodes');
  }

  hazmatCodes(): Observable<HazmatClass[]> {
    return this.http.get<HazmatClass[]>('/gateway/api/xtr/v1/hazmat/class');
  }
}
