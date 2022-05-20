import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { selectNetworks } from '../../state';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm } from '../../models/network-form.model';
import { CustomAddress } from '../../models/custom-address.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { PLANNING_TYPE_OPTIONS, SERVICE_LEVEL_OPTIONS, TRANSPORT_TYPE_OPTIONS } from './constants';
import { CommonValidators } from '../../utils/validators';
import {
  loadConsignors,
  loadShipFrom,
  loadShipTo,
  loadUnloadingPoint,
  selectConsignors,
  selectNewBooking,
  selectShipFrom,
  selectShipTo,
  selectUnloadPoint,
} from '../../state/network-form';
import { PartyLocation } from '../../models/location.model';
import { XtrService } from '../../services/xtr.service';

@UntilDestroy()
@Component({
  selector: 'app-tbr-network-form',
  templateUrl: './tbr-network-form.component.html',
})
export class TbrNetworkFormComponent implements AfterViewInit {
  @ViewChild('consignorDialog')
  consignorDialog!: DialogComponent;

  @ViewChild('consigneeDialog')
  consigneeDialog!: DialogComponent;

  @ViewChild('customAddressDialog')
  customAddressDialog!: DialogComponent;

  @ViewChild('shipFromListDialog')
  shipFromListDialog!: DialogComponent;

  @ViewChild('shipToListDialog')
  shipToListDialog!: DialogComponent;

  @ViewChild('unloadingPointDialogRef')
  unloadingPointDialog!: DialogComponent;

  private fb: IFormBuilder;
  private parmaSelection?: 'consignor' | 'consignee';
  private addressSelection?: 'shipFrom' | 'shipTo';
  private loadingPointSelection?: 'loadingPoint' | 'unloadingPoint';

  availableNetworks$ = this.store.select(selectNetworks);
  unloadingPoints$ = this.store.select(selectUnloadPoint);
  listOfShipFrom$ = this.store.select(selectShipFrom);
  listOfShipTo$ = this.store.select(selectShipTo);
  lostOfConsignors$ = this.store.select(selectConsignors);
  listOfConsignees$: PartyLocation[] = [];

  showAvailableNetwork = false;
  addressToApprove?: string;

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

  data: any;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private store: Store,
    private commonValidators: CommonValidators,
    private xtrService: XtrService
  ) {
    this.fb = fb;
    this.store.dispatch(loadShipFrom());
    this.store.dispatch(loadShipTo());
    this.store.dispatch(loadConsignors());

    this.createForms();
    this.watchForms();

    this.store
      .select(selectNewBooking)
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.data = data;
          this.networkForm.patchValue(data as any);
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.openConsigneeDialogBound = () => {
        this.parmaSelection = 'consignee';
        TbrNetworkFormComponent.openDialog.call(this, this.consigneeDialog);
      };
      this.openConsignorDialogBound = () => {
        this.parmaSelection = 'consignor';
        TbrNetworkFormComponent.openDialog.call(this, this.consignorDialog);
      };
      this.openShipToListDialogBound = () => {
        this.addressSelection = 'shipTo';
        TbrNetworkFormComponent.openDialog.call(this, this.shipToListDialog);
      };
      this.openShipFromListDialogBound = () => {
        this.addressSelection = 'shipFrom';
        TbrNetworkFormComponent.openDialog.call(this, this.shipFromListDialog);
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

  get addressDialogHeader(): string {
    if (this.addressSelection === 'shipFrom') {
      return 'COMMON.SHIP_FROM';
    }
    if (this.addressSelection === 'shipTo') {
      return 'COMMON.SHIP_TO';
    }
    return '';
  }

  closeCustomAddressDialog(): void {
    this.customAddressForm.reset();
    this.customAddressForm.markAsPristine();
    this.customAddressDialog.closeDialog();
  }

  selectLoadingPoint(loadingPoint: string): void {
    if (this.loadingPointSelection === 'unloadingPoint') {
      this.networkForm.controls.unloadingPoint.setValue(loadingPoint);
    } else {
      this.networkForm.controls.loadingPoint.setValue(loadingPoint);
    }
    this.unloadingPointDialog.closeDialog();
  }

  saveCustomAddress(): void {
    if (this.customAddressForm.invalid) {
      return;
    }

    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue('CUSTOM');
    } else {
      this.networkForm.controls.shipTo.setValue('CUSTOM');
    }
    // UPDATE TBR WITH CUSTOM ADDRESS
    this.closeCustomAddressDialog();
  }

  selectShipItem(shipItem: PartyLocation): void {
    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue(shipItem.parmaId);
      this.shipFromListDialog.closeDialog();
    } else {
      this.networkForm.controls.shipTo.setValue(shipItem.parmaId);
      this.shipToListDialog.closeDialog();
    }
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

  selectConsignee(parma: PartyLocation): void {
    this.networkForm.controls.consignee.setValue(parma.parmaId);

    this.consigneeDialog.closeDialog();
  }

  selectConsignor(parma: PartyLocation): void {
    this.networkForm.controls.consignor.setValue(parma.parmaId);

    this.consignorDialog.closeDialog();
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

  approveAddress(): void {
    this.customAddressForm.patchValue(
      {
        isAddressValidated: !this.customAddressForm.controls.isAddressValidated.value,
      },
      { emitEvent: false }
    );
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
      isAddressValidated: [false, Validators.requiredTrue],
    });
  }

  private watchForms(): void {
    this.networkForm.controls.shipTo.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.xtrService.getShipToLocation(this.data.shipitId, value).subscribe();
        this.store.dispatch(loadUnloadingPoint({ data: value }));
      }
    });

    this.customAddressForm.valueChanges
      .pipe(
        filter((value) => {
          if (value) {
            return !Object.values(value).some((v) => v == null);
          }
          return false;
        }),
        switchMap((value) => this.commonValidators.validateAddressWithGoogle(value)),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.customAddressForm.patchValue(
          {
            isAddressValidated: false,
          },
          {
            emitEvent: false,
          }
        );
        this.addressToApprove = value?.location?.formatted_address;
      });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  formatShipFromValue = (parmaId: string) => {
    return this.listOfShipFrom$.pipe(
      filter(Boolean),
      map((shipFroms) => shipFroms?.find((shipFrom) => shipFrom.parmaId === parmaId)?.parmaName || parmaId)
    );
  };

  formatShipToValue = (parmaId: string) => {
    return this.listOfShipTo$.pipe(
      filter(Boolean),
      map((shipTos) => shipTos?.find((shipTo) => shipTo.parmaId === parmaId)?.parmaName || parmaId)
    );
  };

  formatConsignorValue = (parmaId: string) => {
    return this.lostOfConsignors$.pipe(
      filter(Boolean),
      map((consignors) => consignors?.find((consignor) => consignor.parmaId === parmaId)?.parmaName || parmaId)
    );
  };
}
