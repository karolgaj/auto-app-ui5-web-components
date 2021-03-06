import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, Subject, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LOCAL_STORAGE, WINDOW } from '../core';
import { CLIENT_ID, PING_REDIRECT_URL, PING_URL, REFRESH_TOKEN_KEY, TOKEN_KEY } from '../core/providers/value-tokens';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenGranted = new Subject<void>();
  tokenGranted$ = this.tokenGranted.asObservable();

  constructor(
    private httpClient: HttpClient,
    @Inject(WINDOW) private window: Window,
    @Inject(PING_URL) private pingUrl: string,
    @Inject(PING_REDIRECT_URL) private pingRedirectUrl: string,
    @Inject(CLIENT_ID) private clientId: string,
    @Inject(REFRESH_TOKEN_KEY) private refreshTokenKey: string,
    @Inject(TOKEN_KEY) private tokenKey: string,
    @Inject(LOCAL_STORAGE) private localStorage: Storage
  ) {}

  get redirectUrl(): string {
    return `${this.pingRedirectUrl}${this.window.location.pathname}`;
  }

  async login(): Promise<void> {
    const codeVerifier = AuthService.generateCodeVerifier();
    this.localStorage.setItem('code_verifier', codeVerifier);
    const codeChallenge = await AuthService.generateCodeChallengeFromVerifier(codeVerifier);
    const url = `${this.pingUrl}/as/authorization.oauth2?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUrl}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(url, '_self');
  }

  getToken(code: string): Observable<{ access_token: string; refresh_token: string }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('client_id', this.clientId);
    body.set('code_verifier', this.localStorage.getItem('code_verifier') as string);
    body.set('redirect_uri', this.redirectUrl);

    return this.httpClient
      .post<{ access_token: string; refresh_token: string }>(`${this.pingUrl}/as/token.oauth2`, body.toString(), {
        headers,
      })
      .pipe(
        tap((data) => {
          this.localStorage.removeItem('code_verifier');
          this.localStorage.setItem(this.tokenKey, data.access_token);
          this.localStorage.setItem(this.refreshTokenKey, data.refresh_token);
          this.tokenGranted.next();
        })
      );
  }

  refreshToken(): Observable<{ access_token: string; refresh_token: string }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', this.localStorage.getItem(this.refreshTokenKey) as string);
    body.set('client_id', this.clientId);
    body.set('redirect_uri', `${this.redirectUrl}`);

    return this.httpClient
      .post<{ access_token: string; refresh_token: string }>(`${this.pingUrl}/as/token.oauth2`, body.toString(), {
        headers,
      })
      .pipe(
        tap((data) => {
          this.localStorage.setItem(this.tokenKey, data.access_token);
          this.localStorage.setItem(this.refreshTokenKey, data.refresh_token);
          this.tokenGranted.next();
        }),
        catchError(() => {
          this.login();
          return EMPTY;
        })
      );
  }

  private static dec2hex(dec: number): string {
    return `0${dec.toString(16)}`.slice(-2);
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
}
