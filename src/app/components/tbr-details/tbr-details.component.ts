import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TbrService } from '../../services/tbr.service';

@Component({
  selector: 'app-tbr-details',
  templateUrl: './tbr-details.component.html',
  styleUrls: ['./tbr-details.component.scss'],
})
export class TbrDetailsComponent implements OnInit {
  public details = this.tbrService.getTbrDetails();

  constructor(private router: Router, private tbrService: TbrService) {}

  ngOnInit(): void {}

  goBack() {
    this.router.navigate(['../']);
  }
}
