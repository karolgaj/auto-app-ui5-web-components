import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.provider';

export const LOCAL_STORAGE = new InjectionToken('LocalStorageToken', {
  providedIn: 'root',
  factory: () => inject(WINDOW).localStorage,
});
