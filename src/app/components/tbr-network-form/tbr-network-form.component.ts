import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { createTbr, loadAvailableNetworks, loadConsignors, loadShipItems, loadUnloadingPoints } from '../../state/tbr.actions';
import { TbrLightDetails } from '../../models/tbr-light.model';
import { NetworkForm } from '../../models/network-form.model';
import { selectConsignors, selectNetworks, selectShipItems, selectUnloadingPoints } from '../../state/tbr.selectors';
import { CustomAddress } from '../../models/custom-address.model';
import { TbrNetwork } from '../../models/tbr-network.model';

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

  networkForm!: IFormGroup<NetworkForm>;
  customAddressForm!: IFormGroup<CustomAddress>;
  initFinish = false;

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
    this.openConsigneeDialogBound = () => {
      this.parmaSelection = 'consignee';
      this.openDialog.call(this, this.parmaDialog);
    };
    this.openConsignorDialogBound = () => {
      this.parmaSelection = 'consignor';
      this.openDialog.call(this, this.parmaDialog);
    };
    this.openShipToListDialogBound = () => {
      this.addressSelection = 'shipTo';
      this.openDialog.call(this, this.shipListDialog);
    };
    this.openShipFromListDialogBound = () => {
      this.addressSelection = 'shipFrom';
      this.openDialog.call(this, this.shipListDialog);
    };
    this.openCustomShipToAddressDialogBound = () => {
      this.addressSelection = 'shipTo';
      this.openDialog.call(this, this.customAddressDialog);
    };
    this.openCustomShipFromAddressDialogBound = () => {
      this.addressSelection = 'shipFrom';
      this.openDialog.call(this, this.customAddressDialog);
    };
    this.openUnloadingPointDialogBound = this.openDialog.bind(this, this.unloadingPointDialog);

    setTimeout(() => {
      this.initFinish = true;
    }, 100);
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
      customs: [false],
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
      console.log(data);
      this.store.dispatch(loadAvailableNetworks({ data }));
      this.store.dispatch(loadUnloadingPoints({ data }));
    });
  }

  openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
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

  selectUnloadingPoint(unloadingPoint: string): void {
    this.networkForm.controls.shipFrom.setValue(unloadingPoint);
    this.closeUnloadingPointDialog();
  }

  saveCustomAddress(): void {
    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue('CUSTOM');
    } else if (this.addressSelection === 'shipTo') {
      this.networkForm.controls.shipTo.setValue('CUSTOM');
    }
    // UPDATE TBR WITH CUSTOM ADDRESS
    this.closeCustomAddressDialog();
  }

  selectShipItem(shipItem: any): void {
    if (this.addressSelection === 'shipFrom') {
      this.networkForm.controls.shipFrom.setValue(shipItem.parma);
    } else if (this.addressSelection === 'shipTo') {
      this.networkForm.controls.shipTo.setValue(shipItem.parma);
    }
    this.closeShipListDialog();
  }

  goBack() {
    this.router.navigate(['../']);
  }

  chooseNetwork(tbrNetwork: TbrNetwork) {
    this.networkForm.patchValue({
      consignor: tbrNetwork.consignorId,
      consignee: tbrNetwork.consigneeId,
      shipTo: tbrNetwork.shipToId,
      shipFrom: tbrNetwork.shipFromId,
      unloadingPoint: tbrNetwork.unloadingPoint,
    });
  }

  createTbr(): void {
    const payload: Partial<TbrLightDetails> = {
      ...this.networkForm.getRawValue(),
    };

    this.store.dispatch(createTbr({ data: payload }));
  }

  selectParma(parma: any) {
    if (this.parmaSelection === 'consignor') {
      this.networkForm.controls.consignor.setValue(parma.parma);
    } else if (this.parmaSelection === 'consignee') {
      this.networkForm.controls.consignee.setValue(parma.parma);
    }

    this.closeParmaDialog();
  }
}
