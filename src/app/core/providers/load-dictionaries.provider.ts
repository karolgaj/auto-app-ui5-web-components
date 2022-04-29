import { APP_INITIALIZER, Provider } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { loadCountryList, loadHazmatClasses, loadReasonCodes } from '../../state/dictionaries/dictionaries.actions';
import { AuthService } from '../../services';

export const LoadDictionariesProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [Store, AuthService],
  useFactory: (store: Store, authService: AuthService) => () => {
    authService.tokenGranted$.pipe(take(1)).subscribe(() => {
      store.dispatch(loadCountryList());
      store.dispatch(loadHazmatClasses());
      store.dispatch(loadReasonCodes());
    });
  },
};
