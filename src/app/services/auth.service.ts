import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login() {
    return this.httpClient.get(
      'https://federate-qa.volvo.com/as/authorization.oauth2?client_id=shipit&response_type=token&redirect_uri=https://localhost:4200'
    );
  }
}
