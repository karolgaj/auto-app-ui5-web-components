import { Component, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { IFormArray, IFormBuilder } from '@rxweb/types';
import { filter, map, pluck, switchMap } from 'rxjs/operators';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';

import { TbrService } from '../../services';
import { addHazmatDetails, deleteHazmatDetails, selectedTbr } from '../../state';

interface AddHazmatForm {
  hazmatClass: string;
  hazmatPackagingGroup: string;
  hazmatPropperShippingName: string;
  hazmatUnode: string;
}
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
  private shipitId?: string;
  private releaseLineId?: any;
  addHazmatFormGroup!: IFormArray<AddHazmatForm>;
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

    this.releaseLineId = this.line$.pipe(pluck('releaseLineId'));
    this.thuList$ = this.store.select(selectedTbr).pipe(
      filter((tbrDetails) => !!tbrDetails),
      map((tbrDetails) => {
        this.shipitId = tbrDetails?.shipitId;
        // console.log('lineId', this.line$.pipe(take(1)).subscribe);
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
    this.releaseLineId.subscribe((value: string) => {
      this.store.dispatch(
        addHazmatDetails({
          data: {
            shipItId: this.shipitId,
            releaseLineId: value,
            payload: { ...this.addHazmatFormGroup.getRawValue() },
          },
        })
      );
    });

    this.cancelAddHazmat();
  }

  removeHazmatDetails() {
    this.addHazmatFormGroup.reset();
    this.addHazmatFormGroup.markAsPristine();
    this.releaseLineId.subscribe((value: string) => {
      this.store.dispatch(
        deleteHazmatDetails({
          data: {
            shipItId: this.shipitId,
            releaseLineId: value,
          },
        })
      );
    });

    this.createForm();
  }
  openAddHazmatDialog() {
    if (this.addHazmatFormGroup.length === 1) return;
    this.addHazmatFormGroup.push(
      this.fb.group<AddHazmatForm>({
        hazmatClass: [null],
        hazmatPackagingGroup: [null],
        hazmatPropperShippingName: [null],
        hazmatUnode: [null],
      })
    );
    this.addHazmatDialog.openDialog();
  }

  cancelAddHazmat() {
    this.addHazmatFormGroup.reset();
    this.addHazmatFormGroup.markAsPristine();
    this.createForm();
    this.addHazmatDialog.closeDialog();
  }

  getFormGroup(rowForm: any): FormGroup {
    return rowForm as FormGroup;
  }
  private createForm(): void {
    this.addHazmatFormGroup = this.fb.array<AddHazmatForm>([]);
  }
}
