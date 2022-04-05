import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { TbrService } from '../../services';
import { selectedTbr } from '../../state';

@Component({
  selector: 'app-thu-details',
  templateUrl: './thu-details.component.html',
  styleUrls: ['./thu-details.component.scss'],
})
export class ThuDetailsComponent implements OnInit {
  public line$;
  public thuList$;

  constructor(private tbrService: TbrService, private router: Router, private route: ActivatedRoute, private store: Store) {
    this.line$ = this.route.paramMap.pipe(
      switchMap((paramMap) => {
        const articleNumber = paramMap.get('articleNumber');
        return this.store.select(selectedTbr).pipe(map((tbr) => tbr!.lines.find((line) => line.articleNumber === articleNumber)));
      })
    );

    this.thuList$ = this.store.select(selectedTbr).pipe(
      map((tbrDetails) => {
        const thus = tbrDetails!.shipUnitLines.map((slu) => slu.transportHandlingUnits).reduce((acc, curr) => acc.concat(curr));
        return thus[0];
      })
    );

    this.thuList$.subscribe();
  }

  ngOnInit(): void {}

  goBack() {
    this.route.paramMap.subscribe((paramMap) => {
      this.router.navigate(['/', paramMap.get('shipItId')]);
    });
  }
}
