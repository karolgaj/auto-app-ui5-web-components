import { Component, OnInit } from '@angular/core';
import { TbrService } from '../../services/tbr.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thu-details',
  templateUrl: './thu-details.component.html',
  styleUrls: ['./thu-details.component.scss'],
})
export class ThuDetailsComponent implements OnInit {
  public details = this.tbrService.getTbrDetails();

  constructor(private tbrService: TbrService, private router: Router) {}

  ngOnInit(): void {}

  goBack(shipitId: string) {
    this.router.navigate(['/', shipitId]);
  }
}
