import { APP_INITIALIZER, Provider } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCountryList, loadHazmatClasses, loadReasonCodes } from '../../state/dictionaries/dictionaries.actions';

export const LoadDictionariesProvider: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [Store],
  useFactory: (store: Store) => () => {
    store.dispatch(loadCountryList());
    store.dispatch(loadHazmatClasses());
    store.dispatch(loadReasonCodes());
  },
};
