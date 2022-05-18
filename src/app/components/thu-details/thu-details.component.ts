import { Component, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { IFormArray, IFormBuilder } from '@rxweb/types';
import { Observable } from 'rxjs';
import { filter, map, pluck, switchMap, take } from 'rxjs/operators';
import { TbrLine } from 'src/app/models/tbr-line.model';
import { HazmatDetails } from 'src/app/models/tbr.model';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';

import { TbrService } from '../../services';
import { addHazmatDetails, deleteHazmatDetails, selectedTbr } from '../../state';

@UntilDestroy()
@Component({
  selector: 'app-thu-details',
  templateUrl: './thu-details.component.html',
  styleUrls: ['./thu-details.component.scss'],
})
export class ThuDetailsComponent {
  @ViewChild('addHazmatDialog')
  addHazmatDialog!: DialogComponent;

  public line$;

  public thuList$;
  private shipitId!: string;
  private releaseLineId$: Observable<string>;
  addHazmatFormGroup!: IFormArray<HazmatDetails>;
  private fb: IFormBuilder;

  constructor(
    private tbrService: TbrService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    fb: FormBuilder
  ) {
    this.line$ = this.route.paramMap.pipe(
      switchMap((paramMap) => {
        const articleNumber = paramMap.get('articleNumber');
        return this.store.select(selectedTbr).pipe(
          map((tbr) => {
            if (tbr) {
              return tbr.lines.find((line: { articleNumber: string }) => line.articleNumber === articleNumber);
            }
            return undefined;
          })
        );
      })
    );

    this.releaseLineId$ = this.line$.pipe(filter(Boolean), pluck<TbrLine>('releaseLineId')) as Observable<string>;

    this.thuList$ = this.store.select(selectedTbr).pipe(
      filter(Boolean),
      map((tbrDetails) => {
        this.shipitId = tbrDetails?.shipitId;
        const thus = tbrDetails?.shipUnitLines.map((slu) => slu.transportHandlingUnits).reduce((acc, curr) => acc.concat(curr));
        return thus ? thus[0] : null;
      })
    );
    this.fb = fb;
    this.thuList$.subscribe();
    this.createForm();
  }

  goBack(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.router.navigate(['/', 'xtr', paramMap.get('shipItId')]);
    });
  }

  saveAddHazmat() {
    this.releaseLineId$.pipe(take(1)).subscribe((value: string) => {
      this.store.dispatch(
        addHazmatDetails({
          shipitId: this.shipitId,
          releaseLineId: value,
          hazmatDetails: { ...this.addHazmatFormGroup.getRawValue()[0] },
        })
      );
    });

    this.cancelAddHazmat();
  }

  removeHazmatDetails() {
    this.addHazmatFormGroup.reset();
    this.addHazmatFormGroup.markAsPristine();

    this.releaseLineId$.pipe(take(1)).subscribe((value: string) => {
      this.store.dispatch(
        deleteHazmatDetails({
          shipitId: this.shipitId,
          releaseLineId: value,
        })
      );
    });

    this.createForm();
  }
  openAddHazmatDialog() {
    if (this.addHazmatFormGroup.length === 1) return;
    this.addHazmatFormGroup.push(
      this.fb.group<HazmatDetails>({
        dgClass: [null],
        dgPackagingGroup: [null],
        dgProperName: [null],
        hazmatUncode: [null],
      })
    );
    this.addHazmatDialog.openDialog();
  }

  cancelAddHazmat() {
    this.addHazmatFormGroup.reset();
    this.addHazmatFormGroup.markAsPristine();
    this.addHazmatDialog.closeDialog();
  }

  getFormGroup(rowForm: unknown): FormGroup {
    return rowForm as FormGroup;
  }
  private createForm(): void {
    this.addHazmatFormGroup = this.fb.array<HazmatDetails>([]);
  }
}
