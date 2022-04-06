import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUserData } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private store: Store) {
    this.store.dispatch(loadUserData());
  }
}
