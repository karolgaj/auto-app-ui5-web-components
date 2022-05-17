import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TbrService } from '../../services';
import { ShipItStatusTypeName } from '../../models/tbr-type.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { loadTbrs, refreshTbrList, selectTbr, selectTbrsByType } from '../../state';
import { ShipItStatusTypeMap } from './constants';

@Component({
  selector: 'app-tbr-list',
  templateUrl: './tbr-list.component.html',
})
export class TbrListComponent {
  readonly tbrTypes: ShipItStatusTypeName[] = [
    'Speedups',
    'Drafts',
    'For Approval',
    'Approved',
    'Rejected',
    'Planning',
    'Confirmed',
    'Planned',
  ];

  tbrTypesLists: Record<ShipItStatusTypeName, Observable<TbrLightDetails[]>>;

  constructor(private tbrService: TbrService, private router: Router, private store: Store) {
    this.store.dispatch(loadTbrs({ data: { query: '' } }));

    this.tbrTypesLists = {} as Record<ShipItStatusTypeName, Observable<TbrLightDetails[]>>;
    this.tbrTypes.forEach((tbrType) => {
      this.tbrTypesLists[tbrType] = this.store.select(selectTbrsByType(ShipItStatusTypeMap[tbrType]));
    });
  }

  selectTbr(data: TbrLightDetails): void {
    this.store.dispatch(selectTbr({ data: data.shipitId, redirect: true }));
  }

  goToNetworkForm(): void {
    this.router.navigate(['/', 'xtr', 'network']);
  }

  refreshList(): void {
    this.store.dispatch(refreshTbrList({ data: { query: '' } }));
  }
}
