import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { TbrNetwork } from '../../models/tbr-network.model';
import { TbrService } from '../../services/tbr.service';

interface NetworkForm {
  consignor: string;
  consignee: string;
  shipFrom: string;
  shipTo: string;
  unloadingPoint: string;
  pickupDate: string;
  customs: boolean;
}

@Component({
  selector: 'app-tbr-network-form',
  templateUrl: './tbr-network-form.component.html',
  styleUrls: ['./tbr-network-form.component.scss'],
})
export class TbrNetworkFormComponent implements AfterViewInit {
  @ViewChild('consignorDialog')
  consignorDialog!: DialogComponent;

  @ViewChild('customAddressDialog')
  customAddressDialog!: DialogComponent;

  @ViewChild('shipListDialog')
  shipListDialog!: DialogComponent;

  @ViewChild('unloadingPointDialog')
  unloadingPointDialog!: DialogComponent;

  consignors: any[] = [
    {
      info: 'some info',
      parma: '1234',
      name: 'VOLVO',
    },
  ];
  showAvailableNetwork = false;
  availableNetworks: TbrNetwork[] = [];

  openCustomAddressDialogBound!: () => void;
  openConsignorDialogBound!: () => void;
  openShipListDialogBound!: () => void;
  openUnloadingPointDialogBound!: () => void;

  private fb: IFormBuilder;
  networkForm: IFormGroup<NetworkForm>;
  initFinish = false;

  constructor(fb: FormBuilder, private router: Router, private tbrService: TbrService) {
    this.fb = fb;
    this.networkForm = this.fb.group<NetworkForm>({
      consignor: [null],
      consignee: [null],
      shipFrom: [null],
      shipTo: [null],
      unloadingPoint: [null],
      pickupDate: [null],
      customs: [false],
    });
  }

  ngAfterViewInit(): void {
    this.openCustomAddressDialogBound = this.openDialog.bind(this, this.customAddressDialog);
    this.openConsignorDialogBound = this.openDialog.bind(this, this.consignorDialog);
    this.openShipListDialogBound = this.openDialog.bind(this, this.shipListDialog);
    this.openUnloadingPointDialogBound = this.openDialog.bind(this, this.unloadingPointDialog);

    setTimeout(() => {
      this.initFinish = true;
      this.tbrService.getTbrNetworks().subscribe((data) => {
        // console.log(data);
        this.availableNetworks = data;
      });
    }, 100);
  }

  openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  closeCustomAddressDialog(): void {
    this.customAddressDialog.closeDialog();
  }

  saveCustomAddress(): void {
    this.customAddressDialog.closeDialog();
  }

  closeShipListDialog(): void {
    this.shipListDialog.closeDialog();
  }

  saveShipListDialog(): void {
    this.shipListDialog.closeDialog();
  }

  closeConsignorDialog(): void {
    this.consignorDialog.closeDialog();
  }

  closeUnloadingPointDialog(): void {
    this.unloadingPointDialog.closeDialog();
  }

  selectUnlaodingPoint($event: any): void {
    console.log($event);
  }

  selectShipItem(consignor: any): void {}

  goBack() {
    this.router.navigate(['../']);
  }

  chooseNetwork($event: any) {
    console.log($event);
  }
}
