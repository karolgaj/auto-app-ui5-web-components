import { Component, OnInit } from '@angular/core';
import { TbrService } from '../../services/tbr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-thu-details',
  templateUrl: './thu-details.component.html',
  styleUrls: ['./thu-details.component.scss'],
})
export class ThuDetailsComponent implements OnInit {
  public line$;
  public thuList$;

  constructor(private tbrService: TbrService, private router: Router, private route: ActivatedRoute) {
    this.line$ = this.route.paramMap.pipe(
      switchMap((paramMap) => {
        const articleNumber = paramMap.get('articleNumber');
        return this.tbrService.getTbrDetails().pipe(map((tbr) => tbr.lines.find((line) => line.articleNumber === articleNumber)));
      }),
      tap(console.log)
    );

    this.thuList$ = this.tbrService.getTbrDetails().pipe(
      map((tbrDetails) => {
        const thus = tbrDetails.shipUnitLines.map(slu => slu.transportHandlingUnits).reduce((acc, curr) => acc.concat(curr));
        return thus[0]
      }),
      tap(console.log)
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
