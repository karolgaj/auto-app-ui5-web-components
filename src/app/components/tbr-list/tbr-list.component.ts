import { Component, OnInit } from '@angular/core';
import { TbrService } from '../../services/tbr.service';
import { TbrType } from '../../models/tbr-type.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { Router } from '@angular/router';
import { selectTbrs } from '../../state/tbr.selectors';
import { Store } from '@ngrx/store';
import { loadTbrs, refreshTbrList, selectTbr } from '../../state/tbr.actions';

@Component({
  selector: 'app-tbr-list',
  templateUrl: './tbr-list.component.html',
  styleUrls: ['./tbr-list.component.scss'],
})
export class TbrListComponent implements OnInit {
  public tbrList = this.store.select(selectTbrs);
  public readonly tbrTypes: TbrType[] = ['Drafts', 'For Approval', 'Approved', 'Rejected', 'Planning', 'Confirmed', 'Planned'];

  constructor(private tbrService: TbrService, private router: Router, private store: Store) {
    this.store.dispatch(loadTbrs());
  }

  ngOnInit(): void {}

  selectTbr(data: TbrLightDetails) {
    this.store.dispatch(selectTbr({ data: data.shipitId }));
  }

  goToNetworkForm() {
    this.router.navigate(['network']);
  }

  refreshList() {
    this.store.dispatch(refreshTbrList());
  }
}
