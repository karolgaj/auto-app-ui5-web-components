import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { TbrService } from '../../services';
import { TbrType } from '../../models/tbr-type.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { loadTbrs, refreshTbrList, selectTbr, selectTbrs } from '../../state';

@Component({
  selector: 'app-tbr-list',
  templateUrl: './tbr-list.component.html',
})
export class TbrListComponent {
  public tbrList = this.store.select(selectTbrs);
  public readonly tbrTypes: TbrType[] = ['Drafts', 'For Approval', 'Approved', 'Rejected', 'Planning', 'Confirmed', 'Planned'];

  constructor(private tbrService: TbrService, private router: Router, private store: Store) {
    this.store.dispatch(loadTbrs({ data: { query: '' } }));
  }

  selectTbr(data: TbrLightDetails): void {
    this.store.dispatch(selectTbr({ data: data.shipitId }));
  }

  goToNetworkForm(): void {
    void this.router.navigate(['/', 'xtr', 'network']);
  }

  refreshList(): void {
    this.store.dispatch(refreshTbrList({ data: { query: '' } }));
  }
}
