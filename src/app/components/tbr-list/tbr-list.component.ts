import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, debounceTime, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ShipItStatusTypeName } from '../../models/tbr-type.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { loadTbrs, refreshTbrList, selectedTbr, selectTbr, selectTbrsByType } from '../../state';
import { ShipItStatusTypeMap } from './constants';
import { createEmptyBooking } from '../../state/network-form';

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
  searchFormControl = new FormControl('');
  selectedTbr$ = this.store.select(selectedTbr).pipe(map((tbr) => tbr?.shipitId));

  constructor(private router: Router, private store: Store) {
    this.store.dispatch(loadTbrs({ data: { query: '' } }));

    this.tbrTypesLists = {} as Record<ShipItStatusTypeName, Observable<TbrLightDetails[]>>;
    this.tbrTypes.forEach((tbrType) => {
      this.tbrTypesLists[tbrType] = combineLatest([
        this.store.select(selectTbrsByType(ShipItStatusTypeMap[tbrType])),
        this.searchFormControl.valueChanges.pipe(debounceTime(200), startWith('')),
      ]).pipe(
        map(([tbrDetails, search]: [TbrLightDetails[], string]) => {
          if (search == null || search === '') {
            return tbrDetails;
          }
          return tbrDetails?.filter((details) => Object.values(details).join('').includes(search));
        })
      );
    });
  }

  selectTbr(data: TbrLightDetails): void {
    this.store.dispatch(selectTbr({ data: data.shipitId, redirect: true }));
  }

  goToNetworkForm(): void {
    this.store.dispatch(createEmptyBooking());
  }

  refreshList(): void {
    this.store.dispatch(refreshTbrList({ data: { query: '' } }));
  }

  clearSearch = () => {
    this.searchFormControl.setValue('');
  };
}
