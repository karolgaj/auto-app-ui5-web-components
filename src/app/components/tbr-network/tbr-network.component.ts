import { Component, Input } from '@angular/core';
import { Tbr } from '../../models/tbr.model';

@Component({
  selector: 'app-tbr-network',
  templateUrl: './tbr-network.component.html',
  styleUrls: ['./tbr-network.component.scss'],
})
export class TbrNetworkComponent {
  @Input()
  public tbrDetails!: Tbr;
}
