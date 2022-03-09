import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

interface NetworkForm {
  consignor: string;
  consignee: string;
  shipFrom: string;
  shipTo: string;
  unloadingPoint: string;
  customs: boolean;
}

@Component({
  selector: 'app-tbr-network-form',
  templateUrl: './tbr-network-form.component.html',
  styleUrls: ['./tbr-network-form.component.scss'],
})
export class TbrNetworkFormComponent implements OnInit {
  @ViewChild('consignorDialog')
  consignorDialog!: ElementRef;

  @ViewChild('customAddressDialog')
  customAddressDialog!: DialogComponent;

  @ViewChild('shipListDialog')
  shipListDialog!: ElementRef;

  consignors: any[] = [
    {
      info: 'some info',
      parma: '1234',
      name: 'VOLVO',
    },
  ];

  openCustomAddressDialogBound = this.openCustomAddressDialog.bind(this);
  openConsignorDialogBound = this.openConsignorDialog.bind(this);
  openShipListDialogBound = this.openShipListDialog.bind(this);

  private fb: IFormBuilder;
  networkForm: IFormGroup<NetworkForm>;

  constructor(fb: FormBuilder) {
    this.fb = fb;
    this.networkForm = this.fb.group<NetworkForm>({
      consignor: [null],
      consignee: [null],
      shipFrom: [null],
      shipTo: [null],
      unloadingPoint: [null],
      customs: [false],
    });
  }

  ngOnInit(): void {}

  private openConsignorDialog() {
    this.consignorDialog.nativeElement.show();
  }

  closeConsignorDialog() {
    this.consignorDialog.nativeElement.close();
  }

  private openShipListDialog() {
    this.shipListDialog.nativeElement.show();
  }

  openUnloadingPointDialog() {}

  private openCustomAddressDialog() {
    this.customAddressDialog.openDialog();
  }

  closeCustomAddressDialog() {
    this.customAddressDialog.closeDialog();
  }

  saveCustomDialog() {}

  customDialogClose() {}
}
