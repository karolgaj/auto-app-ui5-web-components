import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  private static dec2hex(dec: number): string {
    return ('0' + dec.toString(16)).substr(-2);
  }

  private static generateCodeVerifier(): string {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, AuthService.dec2hex.bind(this)).join('');
  }

  private static sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  private static base64urlencode(a: ArrayBuffer): string {
    let str = '';
    const bytes = new Uint8Array(a);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private static async generateCodeChallengeFromVerifier(v: string): Promise<string> {
    const hashed = await AuthService.sha256(v);
    return AuthService.base64urlencode(hashed);
  }

  async login(): Promise<void> {
    const codeVerifier = AuthService.generateCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);
    const codeChallenge = await AuthService.generateCodeChallengeFromVerifier(codeVerifier);
    const url = `https://federate-qa.volvo.com/as/authorization.oauth2?client_id=shipit&response_type=code&redirect_uri=https://localhost:4200/volvooauth/callback&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(url, '_self');
  }

  getToken(code: string): Observable<{ access_token: string; refresh_token: string }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', 'shipit');
    body.set('code_verifier', localStorage.getItem('code_verifier') as string);
    body.set('redirect_uri', 'https://localhost:4200/volvooauth/callback');

    return this.httpClient
      .post<{ access_token: string; refresh_token: string }>('https://federate-qa.volvo.com/as/token.oauth2', body.toString(), {
        headers,
      })
      .pipe(
        tap(() => {
          localStorage.removeItem('code_verifier');
        })
      );
  }
}
