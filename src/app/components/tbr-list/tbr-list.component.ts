import { Component, OnInit } from '@angular/core';
import { TbrService } from '../../services/tbr.service';
import { TbrType } from '../../models/tbr-type.model';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tbr-list',
  templateUrl: './tbr-list.component.html',
  styleUrls: ['./tbr-list.component.scss'],
})
export class TbrListComponent implements OnInit {
  public tbrList = this.tbrService.getTbrList();
  public readonly tbrTypes: TbrType[] = ['Drafts', 'For Approval', 'Approved', 'Rejected', 'Planning', 'Confirmed', 'Planned'];

  constructor(private tbrService: TbrService, private router: Router) {}

  ngOnInit(): void {}

  selectTbr(data: TbrLightDetails) {
    this.router.navigate([data.shipitId]);
  }

  goToNetworkForm() {
    this.router.navigate(['network']);
  }
}
