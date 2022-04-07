import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUserData } from './state';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './services';

const authCodeFlowConfig: AuthConfig = {
  issuer: 'https://federate-qa.volvo.com/as/authorization.oauth2',
  loginUrl: 'https://federate-qa.volvo.com/as/token.oauth2',
  redirectUri: 'https://localhost:4200/volvooauth/callback',
  clientId: 'shipit',
  dummyClientSecret: '4uh9zdhy5rt4xeLiveSnvVl1ghIKEFZGpUOkBa4h02Hfmp0vMGM2gQ2dgnWhPLF3',
  responseType: 'code',
  showDebugInformation: true,
  sessionChecksEnabled: true,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private store: Store, private oauthService: OAuthService, private authService: AuthService) {
    // this.oauthService.configure(authCodeFlowConfig);
    // this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    //   this.oauthService.initCodeFlow();
    // });

    // this.authService.login().subscribe(console.log)

    this.store.dispatch(loadUserData());
  }
}
