import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { createTbr, loadAvailableNetworks, loadConsignors, loadShipItems, loadUnloadingPoints } from '../../state/tbr.actions';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm, PlanningType, ServiceLevel, TransportType } from '../../models/network-form.model';
import { selectConsignors, selectNetworks, selectShipItems, selectUnloadingPoints } from '../../state/tbr.selectors';
import { CustomAddress } from '../../models/custom-address.model';
import { TbrNetwork } from '../../models/tbr-network.model';
import { SelectionOption } from '../../models/selection-option.model';
import { filter, take } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-tbr-network-form',
  templateUrl: './tbr-network-form.component.html',
  styleUrls: ['./tbr-network-form.component.scss'],
})
export class TbrNetworkFormComponent implements AfterViewInit {
  private fb: IFormBuilder;
  private parmaSelection?: 'consignor' | 'consignee';
  private addressSelection?: 'shipFrom' | 'shipTo';
  private loadingPointSelection?: 'loadingPoint' | 'unloadingPoint';

  @ViewChild('parmaDialog')
  parmaDialog!: DialogComponent;

  @ViewChild('customAddressDialog')
  customAddressDialog!: DialogComponent;

  @ViewChild('shipListDialog')
  shipListDialog!: DialogComponent;

  @ViewChild('unloadingPointDialog')
  unloadingPointDialog!: DialogComponent;

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

  serviceLevelOptions: SelectionOption<ServiceLevel>[] = [
    {
      text: 'Standard Inbound',
      value: 'STD_INB',
    },
    {
      text: 'Closed Loop',
      value: 'CLOSED_LOOP',
    },
  ];
  transportTypeOptions: SelectionOption<TransportType>[] = [
    {
      text: 'FCL',
      value: 'FCL',
    },
    {
      text: 'FTL',
      value: 'FTL',
    },
    {
      text: 'LCL',
      value: 'LCL',
    },
    {
      text: 'LTL',
      value: 'LTL',
    },
    {
      text: 'MIX',
      value: 'MIX',
    },
  ];
  planningTypesOptions: SelectionOption<PlanningType>[] = [
    {
      text: 'Express',
      value: 'EXPRESS',
    },
    {
      text: 'Inbound',
      value: 'INBOUND',
    },
    {
      text: 'Outbound',
      value: 'OUTBOUND',
    },
  ];

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
      return 'Consignors';
    }
    if (this.parmaSelection === 'consignee') {
      return 'Consignees';
    }
    return '';
  }
  get addressDialogHeader(): string {
    if (this.addressSelection === 'shipFrom') {
      return 'Custom Ship From Address';
    }
    if (this.addressSelection === 'shipTo') {
      return 'Custom Ship To Address';
    }
    return '';
  }
  get shipListDialogHeader(): string {
    if (this.addressSelection === 'shipFrom') {
      return 'Ship From';
    }
    if (this.addressSelection === 'shipTo') {
      return 'Ship To';
    }
    return '';
  }

  constructor(fb: FormBuilder, private router: Router, private store: Store) {
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
    });

    setTimeout(() => {
      this.initFinish = true;
    }, 500);
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

  selectLoadingPoint(loadingPoint: string): void {
    if (this.loadingPointSelection === 'unloadingPoint') {
      this.networkForm.controls.unloadingPoint.setValue(loadingPoint);
    } else {
      this.networkForm.controls.loadingPoint.setValue(loadingPoint);
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

  goBack() {
    this.router.navigate(['../']);
  }

  chooseNetwork(tbrNetwork: TbrNetwork) {
    this.networkForm.patchValue({
      ...tbrNetwork,
      consignor: tbrNetwork.consignorId,
      consignee: tbrNetwork.consigneeId,
      shipTo: tbrNetwork.shipToId,
      shipFrom: tbrNetwork.shipFromId,
    });
  }

  createTbr(): void {
    const payload: Partial<TbrLightDetails> = {
      ...this.networkForm.getRawValue(),
    };

    this.store.dispatch(createTbr({ data: payload }));
  }

  selectParma(parma: { parma: string }) {
    if (this.parmaSelection === 'consignor') {
      this.networkForm.controls.consignor.setValue(parma.parma);
    } else if (this.parmaSelection === 'consignee') {
      this.networkForm.controls.consignee.setValue(parma.parma);
    }

    this.closeParmaDialog();
  }

  toggleAvailableNetwork() {
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
      consignor: [null],
      consignee: [null],
      shipFrom: [null],
      shipTo: [null],
      unloadingPoint: [null],
      loadingPoint: [null],
      pickupDate: [null],
      freightClass: [null],
      planningType: ['INBOUND'],
      serviceLevel: ['STD_INB'],
      transportType: ['FTL'],
      customs: [false],
      doNotMerge: [false],
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
    this.networkForm.valueChanges.pipe(untilDestroyed(this)).subscribe((data) => {
      if (!data) {
        return;
      }
      this.store.dispatch(loadAvailableNetworks({ data }));
      this.store.dispatch(loadUnloadingPoints({ data }));
    });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }
}
