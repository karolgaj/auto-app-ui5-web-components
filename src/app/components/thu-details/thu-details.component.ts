import { Component, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { filter, map, switchMap } from 'rxjs/operators';
import { DialogComponent } from 'src/app/ui/dialog/dialog.component';

import { TbrService } from '../../services';
import { selectedTbr } from '../../state';

interface AddHazmatForm {
  hazmatClass: string;
  hazmatPackagingGroup: string;
  hazmatPropperShippingName: string;
  hazmatUnode: string;
}

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
  addHazmatFormGroup!: IFormArray<AddHazmatForm>;
  hazmatDetails?:any[];
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return tbr.lines.find((line: { articleNumber: string }) => line.articleNumber === articleNumber);
            }
            return undefined;
          })
        );
      })
    );

    this.thuList$ = this.store.select(selectedTbr).pipe(
      filter((tbrDetails) => !!tbrDetails),
      map((tbrDetails) => {
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
console.log(this.addHazmatFormGroup.value)

    this.cancelAddHazmat();
  }
  openAddHazmatDialog() {
    if(this.addHazmatFormGroup.length === 1) return;
    this.addHazmatFormGroup.push(this.fb.group<AddHazmatForm>({  hazmatClass: ["1"],
      hazmatPackagingGroup: ["1"],
      hazmatPropperShippingName: ["2"],
      hazmatUnode: ["2"]}))
    this.addHazmatDialog.openDialog();
  }

  cancelAddHazmat() {
    this.addHazmatDialog.closeDialog();
  }

  getFormGroup(rowForm: any): FormGroup {
    return rowForm as FormGroup;
  }
  private createForm(): void {
    this.addHazmatFormGroup = this.fb.array<AddHazmatForm>([

    ]);
  }
}
