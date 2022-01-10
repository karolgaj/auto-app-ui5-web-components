import { Component, OnInit } from '@angular/core';
import { TbrService } from '../../services/tbr.service';

@Component({
  selector: 'app-tbr-list',
  templateUrl: './tbr-list.component.html',
  styleUrls: ['./tbr-list.component.scss'],
})
export class TbrListComponent implements OnInit {
  public tbrList = this.tbrService.getTbrs();
  public readonly tbrTypes = ['Drafts', 'For Approval', 'Approved', 'Rejected', 'Planning', 'Confirmed', 'Planned'];

  constructor(private tbrService: TbrService) {}

  ngOnInit(): void {}
}
