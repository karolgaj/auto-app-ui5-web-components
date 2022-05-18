import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { filter, startWith, take } from 'rxjs/operators';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import {
  loadConsignors,
  loadShipItems,
  loadShipPoints,
  loadUnloadingPoints,
  selectConsignors,
  selectNetworks,
  selectShipItems,
  selectUnloadingPoints,
} from '../../state';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm } from '../../models/network-form.model';
import { CustomAddress } from '../../models/custom-address.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { PLANNING_TYPE_OPTIONS, SERVICE_LEVEL_OPTIONS, TRANSPORT_TYPE_OPTIONS } from './constants';
import { CommonValidators } from '../../utils/validators';
import { UnloadingPoint } from '../../models/unloading-point.model';

@UntilDestroy()
@Component({
  selector: 'app-tbr-network-form',
  templateUrl: './tbr-network-form.component.html',
})
export class TbrNetworkFormComponent implements AfterViewInit {
  @ViewChild('parmaDialog')
  parmaDialog!: DialogComponent;

  @ViewChild('customAddressDialog')
  customAddressDialog!: DialogComponent;

  @ViewChild('shipListDialog')
  shipListDialog!: DialogComponent;

  @ViewChild('unloadingPointDialog')
  unloadingPointDialog!: DialogComponent;

  private fb: IFormBuilder;
  private parmaSelection?: 'consignor' | 'consignee';
  private addressSelection?: 'shipFrom' | 'shipTo';
  private loadingPointSelection?: 'loadingPoint' | 'unloadingPoint';

  consignors$ = this.store.select(selectConsignors);
  availableNetworks$ = this.store.select(selectNetworks);
  unloadingPoints$ = this.store.select(selectUnloadingPoints);
  shipItems$ = this.store.select(selectShipItems);
  showAvailableNetwork = false;

  openConsigneeDialogBound!: () => void;
  openConsignorDialogBound!: () => void;
  openShipFromListDialogBound!: () => void;
  openShipToListDialogBound!: () => void;
  openCustomShipToAddressDialogBound!: () => void;
  openCustomShipFromAddressDialogBound!: () => void;
  openUnloadingPointDialogBound!: () => void;
  openLoadingPointDialogBound!: () => void;

  networkForm!: IFormGroup<NetworkForm>;
  customAddressForm!: IFormGroup<CustomAddress>;
  initFinish = false;

  serviceLevelOptions = SERVICE_LEVEL_OPTIONS;
  transportTypeOptions = TRANSPORT_TYPE_OPTIONS;
  planningTypesOptions = PLANNING_TYPE_OPTIONS;

  constructor(fb: FormBuilder, private router: Router, private store: Store, private commonValidators: CommonValidators) {
    this.fb = fb;
    this.store.dispatch(loadConsignors({}));
    this.store.dispatch(loadShipItems());
    this.createForms();
    this.watchForms();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openConsigneeDialogBound = () => {
        this.parmaSelection = 'consignee';
        TbrNetworkFormComponent.openDialog.call(this, this.parmaDialog);
      };
      this.openConsignorDialogBound = () => {
        this.parmaSelection = 'consignor';
        TbrNetworkFormComponent.openDialog.call(this, this.parmaDialog);
      };
      this.openShipToListDialogBound = () => {
        this.addressSelection = 'shipTo';
        TbrNetworkFormComponent.openDialog.call(this, this.shipListDialog);
      };
      this.openShipFromListDialogBound = () => {
        this.addressSelection = 'shipFrom';
        TbrNetworkFormComponent.openDialog.call(this, this.shipListDialog);
      };
      this.openCustomShipToAddressDialogBound = () => {
        this.addressSelection = 'shipTo';
        TbrNetworkFormComponent.openDialog.call(this, this.customAddressDialog);
      };
      this.openCustomShipFromAddressDialogBound = () => {
        this.addressSelection = 'shipFrom';
        TbrNetworkFormComponent.openDialog.call(this, this.customAddressDialog);
      };
      this.openUnloadingPointDialogBound = () => {
        this.loadingPointSelection = 'unloadingPoint';
        TbrNetworkFormComponent.openDialog.call(this, this.unloadingPointDialog);
      };
      this.openLoadingPointDialogBound = () => {
        this.loadingPointSelection = 'loadingPoint';
        TbrNetworkFormComponent.openDialog.call(this, this.unloadingPointDialog);
      };

      this.initFinish = true;
    });
  }

  get parmaDialogAccessibleName(): string {
    if (this.parmaSelection === 'consignor') {
      return 'Consignor Value Help';
    }
    if (this.parmaSelection === 'consignee') {
      return 'Consignees Value Help';
    }
    return '';
  }
  get parmaDialogHeader(): string {
    if (this.parmaSelection === 'consignor') {
      return 'COMMON.CONSIGNOR';
    }
    if (this.parmaSelection === 'consignee') {
      return 'COMMON.CONSIGNEE';
    }
    return '';
  }
  get addressDialogHeader(): string {
    if (this.addressSelection === 'shipFrom') {
      return 'COMMON.SHIP_FROM';
    }
    if (this.addressSelection === 'shipTo') {
      return 'COMMON.SHIP_TO';
    }
    return '';
  }
  get shipListDialogHeader(): string {
    if (this.addressSelection === 'shipFrom') {
      return 'COMMON.SHIP_FROM';
    }
    if (this.addressSelection === 'shipTo') {
      return 'COMMON.SHIP_TO';
    }
    return '';
  }

  closeCustomAddressDialog(): void {
    this.customAddressDialog.closeDialog();
  }
  closeShipListDialog(): void {
    this.shipListDialog.closeDialog();
  }
  closeParmaDialog(): void {
    this.parmaDialog.closeDialog();
  }
  closeUnloadingPointDialog(): void {
    this.unloadingPointDialog.closeDialog();
  }

  selectLoadingPoint(loadingPoint: UnloadingPoint): void {
    if (this.loadingPointSelection === 'unloadingPoint') {
      this.networkForm.controls.unloadingPoint.setValue(loadingPoint.unloadingPoint);
    } else {
      this.networkForm.controls.loadingPoint.setValue(loadingPoint.unloadingPoint);
    }
    this.closeUnloadingPointDialog();
  }

  saveCustomAddress(): void {
    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue('CUSTOM');
    } else {
      this.networkForm.controls.shipTo.setValue('CUSTOM');
    }
    // UPDATE TBR WITH CUSTOM ADDRESS
    this.closeCustomAddressDialog();
  }

  selectShipItem(shipItem: any): void {
    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue(shipItem.parma);
    } else {
      this.networkForm.controls.shipTo.setValue(shipItem.parma);
    }
    this.closeShipListDialog();
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  chooseNetwork(tbrNetwork: TbrNetwork): void {
    this.networkForm.patchValue({
      ...tbrNetwork,
      consignor: tbrNetwork.consignorId,
      consignee: tbrNetwork.consigneeId,
      shipTo: tbrNetwork.shipToId,
      shipFrom: tbrNetwork.shipFromId,
    });
  }

  createTbr(): void {
    if (this.networkForm.invalid) {
      this.networkForm.markAllAsTouched();
      return;
    }
    const payload: Partial<TbrLightDetails> = {
      ...this.networkForm.getRawValue(),
    };

    // console.log(payload);

    // console.log(NEW_XTR);

    // this.store.dispatch(createTbr({ data: payload }));
  }

  selectParma(parma: { parma: string }): void {
    if (this.parmaSelection === 'consignor') {
      this.networkForm.controls.consignor.setValue(parma.parma);
    } else if (this.parmaSelection === 'consignee') {
      this.networkForm.controls.consignee.setValue(parma.parma);
    }

    this.closeParmaDialog();
  }

  toggleAvailableNetwork(): void {
    this.availableNetworks$
      .pipe(
        take(1),
        filter((value) => !!value?.length)
      )
      .subscribe(() => {
        this.showAvailableNetwork = !this.showAvailableNetwork;
      });
  }

  private createForms(): void {
    this.networkForm = this.fb.group<NetworkForm>({
      consignor: [null, [Validators.required]],
      consignee: [null],
      shipFrom: [null, [Validators.required]],
      shipTo: [null, [Validators.required]],
      unloadingPoint: [null, [Validators.required]],
      loadingPoint: [null],
      pickupDate: [null, [Validators.required, CommonValidators.IsNotPastDateValidator]],
      freightClass: [null],
      planningType: ['INBOUND'],
      serviceLevel: ['STD_INB'],
      transportType: ['FTL'],
      customs: [false],
      doNotMerge: [true],
      useLoadingMeters: [false],
    });

    this.customAddressForm = this.fb.group<CustomAddress>({
      city: [null],
      countryCode: [null],
      name: [null],
      postalCode: [null],
      street1: [null],
    });
  }

  private watchForms(): void {
    combineLatest([
      this.networkForm.controls.consignor.valueChanges.pipe(startWith(this.networkForm.controls.consignor.value)),
      this.networkForm.controls.shipFrom.valueChanges.pipe(startWith(this.networkForm.controls.shipFrom.value)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([consignor, shipFrom]) => {
        if (consignor) {
          this.store.dispatch(loadShipPoints({ data: consignor }));

          if (shipFrom != null) {
            this.store.dispatch(
              loadUnloadingPoints({
                data: {
                  shipFrom,
                  consignor,
                },
              })
            );
          }
        }
      });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }
}
