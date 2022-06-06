import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, debounceTime, of, switchMap, tap } from 'rxjs';
import { catchError, filter, map, startWith, take } from 'rxjs/operators';

import { DialogComponent } from '../../ui/dialog/dialog.component';
import { selectUserConsigneeParmas, selectUserConsignorParmas, selectUserRoles } from '../../state';
import { NetworkForm } from '../../models/network-form.model';
import { CustomAddress } from '../../models/custom-address.model';
import { PLANNING_TYPE_OPTIONS, SERVICE_LEVEL_OPTIONS, TRANSPORT_TYPE_OPTIONS } from './constants';
import { CommonValidators } from '../../utils/validators';
import {
  createEmptyBooking,
  loadConsignees,
  loadConsignors,
  loadShipFrom,
  loadShipTo,
  loadUnloadingPoint,
  selectConsignees,
  selectConsignors,
  selectNewBooking,
  selectShipFrom,
  selectShipTo,
  selectUnloadPoint,
  updateNetwork,
} from '../../state/network-form';
import { PartyLocation } from '../../models/location.model';
import { Tbr, TransportParty } from '../../models/tbr.model';
import { XtrService } from '../../services/xtr.service';
import { Network } from '../../models/network.model';

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

  searchFormControl = new FormControl('');
  searchQuery$ = this.searchFormControl.valueChanges.pipe(debounceTime(200), startWith(''));
  isLimitedRequester$ = this.store.select(selectUserRoles).pipe(map((roles) => roles?.includes('EXPRESS_REQUESTER_LIMITED')));
  isUnlimitedRequester$ = this.store.select(selectUserRoles).pipe(map((roles) => roles?.includes('EXPRESS_REQUESTER_UNLIMITED')));
  unloadingPoints$ = combineLatest([this.store.select(selectUnloadPoint), this.searchQuery$]).pipe(
    map(([unloadingPoints, search]) => {
      if (search == null || search === '') {
        return unloadingPoints;
      }
      return unloadingPoints?.filter((unloadPoint) => unloadPoint.includes(search));
    })
  );
  private listOfShipFromLimited$ = combineLatest([this.store.select(selectShipFrom), this.searchQuery$]).pipe(
    map(([shipFroms, search]) => {
      if (search == null || search === '') {
        return shipFroms;
      }
      return shipFroms?.filter((shipFrom) => Object.values(shipFrom).join(',').includes(search));
    })
  );
  private listOfShipToLimited$ = combineLatest([this.store.select(selectShipTo), this.searchQuery$]).pipe(
    map(([shipTos, search]) => {
      if (search == null || search === '') {
        return shipTos;
      }
      return shipTos?.filter((shipTo) => Object.values(shipTo).join(',').includes(search));
    })
  );
  listOfShipFrom$ = this.isLimitedRequester$.pipe(switchMap((value) => (value ? this.listOfShipFromLimited$ : of([]))));
  listOfShipTo$ = this.isLimitedRequester$.pipe(switchMap((value) => (value ? this.listOfShipToLimited$ : of([]))));
  lostOfConsignors$ = combineLatest([
    this.isLimitedRequester$.pipe(
      switchMap((value) => (value ? this.store.select(selectConsignors) : this.store.select(selectUserConsignorParmas)))
    ),
    this.searchQuery$,
  ]).pipe(
    map(([consignors, search]) => {
      if (search == null || search === '') {
        return consignors;
      }
      return consignors?.filter((consignor) => Object.values(consignor).join(',').includes(search));
    })
  );
  listOfConsignees$ = combineLatest([
    this.isLimitedRequester$.pipe(
      switchMap((value) => (value ? this.store.select(selectConsignees) : this.store.select(selectUserConsigneeParmas)))
    ),
    this.searchQuery$,
  ]).pipe(
    map(([consignees, search]) => {
      if (search == null || search === '') {
        return consignees;
      }
      return consignees?.filter((consignee) => Object.values(consignee).join(',').includes(search));
    })
  );

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

  data!: Partial<Tbr> & Required<{ shipitId: string }>;
  private unlimitedShipFrom?: TransportParty;
  private unlimitedShipTo?: TransportParty;
  private unlimitedConsignee?: TransportParty;
  private unlimitedConsignor?: TransportParty;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private store: Store,
    private commonValidators: CommonValidators,
    private xtrService: XtrService
  ) {
    this.fb = fb;

    this.createForms();
    this.watchForms();

    this.store
      .select(selectNewBooking)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        if (data) {
          this.data = data;
        } else {
          this.store.dispatch(createEmptyBooking());
        }
      });

    this.isLimitedRequester$.pipe(filter(Boolean), untilDestroyed(this)).subscribe(() => this.limitedRequestedInitialization());

    this.isUnlimitedRequester$.pipe(filter(Boolean), untilDestroyed(this)).subscribe(() => {
      this.unlimitedRequestedInitialization();
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
    this.searchFormControl.setValue('');
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
    this.searchFormControl.setValue('');
  }

  goBack(): void {
    this.router.navigate(['../']);
  }

  // chooseNetwork(tbrNetwork: TbrNetwork): void {
  //   this.networkForm.patchValue({
  //     ...tbrNetwork,
  //     consignor: tbrNetwork.consignorId,
  //     consignee: tbrNetwork.consigneeId,
  //     shipTo: tbrNetwork.shipToId,
  //     shipFrom: tbrNetwork.shipFromId,
  //   });
  // }

  createTbr(): void {
    if (this.networkForm.invalid) {
      this.networkForm.markAllAsTouched();
      return;
    }

    const networkFormData = this.networkForm.getRawValue();

    const payload: Partial<Network> = {
      customs: networkFormData.customs,
      useLoadingMeters: networkFormData.useLoadingMeters,
      doNotMerge: networkFormData.doNotMerge,
      freightClass: networkFormData.freightClass,
      type: networkFormData.type,
      planningType: networkFormData.planningType,
      serviceLevel: networkFormData.serviceLevel,
      transportType: networkFormData.transportType,
      networkId: null,

      deliveryLeadTime: null,
      incoTerm: null,
      valid: true,
    };

    this.store.dispatch(
      updateNetwork({
        data: payload,
        shipitId: this.data.shipitId,
      })
    );
  }

  selectConsignee(parma: PartyLocation): void {
    this.networkForm.controls.consignee.setValue(parma.parmaId);

    this.consigneeDialog.closeDialog();
    this.searchFormControl.setValue('');
  }

  selectConsignor(parma: PartyLocation): void {
    this.networkForm.controls.consignor.setValue(parma.parmaId);

    this.consignorDialog.closeDialog();
    this.searchFormControl.setValue('');
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
      pickupDate: [null, [Validators.required, CommonValidators.IsNotPastDateValidator()]],
      freightClass: [null],
      planningType: ['DDT'],
      type: ['INBOUND'],
      serviceLevel: ['STD_INB'],
      transportType: ['FTL'],
      customs: [false],
      doNotMerge: [true],
      useLoadingMeters: [false],
      payer: [null, Validators.required],
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
        this.store.dispatch(loadUnloadingPoint({ data: value }));
      }
    });

    this.networkForm.controls.consignee.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.networkForm.controls.payer.patchValue(value);
      }
    });

    this.networkForm.controls.pickupDate.valueChanges
      .pipe(
        filter(Boolean),
        switchMap((value) => this.xtrService.setPickupAndDeadlineDate(this.data.shipitId, value, null, null)),
        untilDestroyed(this)
      )
      .subscribe();

    this.networkForm.controls.unloadingPoint.valueChanges
      .pipe(
        filter(Boolean),
        switchMap((value) => this.xtrService.updateUnloadingPoint(this.data.shipitId, value)),
        untilDestroyed(this)
      )
      .subscribe();

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

  private unlimitedRequestedInitialization(): void {}

  private limitedRequestedInitialization(): void {
    this.store.dispatch(loadShipFrom());
    this.store.dispatch(loadShipTo());
    this.store.dispatch(loadConsignors());
    this.networkForm.controls.consignee.setValidators([Validators.required]);
    this.networkForm.controls.shipTo.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.store.dispatch(loadConsignees({ data: value }));
      }
    });
  }

  private static openDialog(dialog: DialogComponent): void {
    dialog.openDialog();
  }

  formatShipFromValueUnlimited = (v: string) => {
    return of(v).pipe(
      switchMap((value) => {
        if (value == null || value.length === 0) {
          return of(v);
        }
        return this.xtrService.getShipFromLocation(this.data.shipitId, v).pipe(
          tap((shipFrom) => (this.unlimitedShipFrom = shipFrom)),
          map((shipFrom) => `${shipFrom.parma} - ${shipFrom.name}`),
          catchError(() => {
            this.networkForm.controls.shipFrom.setErrors({ parmaNotFound: v });
            return of(v);
          })
        );
      })
    );
  };

  formatShipToValueUnlimited = (v: string) => {
    return of(v).pipe(
      switchMap((value) => {
        if (value == null || value.length === 0) {
          return of(v);
        }
        return this.xtrService.getShipToLocation(this.data.shipitId, v).pipe(
          tap((shipTo) => (this.unlimitedShipTo = shipTo)),
          map((shipTo) => `${shipTo.parma} - ${shipTo.name}`),
          catchError(() => {
            this.networkForm.controls.shipTo.setErrors({ parmaNotFound: v });
            return of(v);
          })
        );
      })
    );
  };

  formatConsigneeValueUnlimited = (v: string) => {
    return of(v).pipe(
      switchMap((value) => {
        if (value == null || value.length === 0) {
          return of(v);
        }
        return this.xtrService.getConsigneeLocation(this.data.shipitId, v).pipe(
          take(1),
          tap((consignee) => (this.unlimitedConsignee = consignee)),
          map((consignee) => `${consignee.parma} - ${consignee.name}`),
          catchError(() => {
            this.networkForm.controls.consignee.setErrors({ parmaNotFound: v });
            return of(v);
          })
        );
      })
    );
  };

  formatConsignorValueUnlimited = (v: string) => {
    return of(v).pipe(
      switchMap((value) => {
        if (value == null || value.length === 0) {
          return of(v);
        }
        return this.xtrService.getConsignorLocation(this.data.shipitId, v).pipe(
          take(1),
          tap((consignor) => (this.unlimitedConsignor = consignor)),
          map((consignor) => `${consignor.parma} - ${consignor.name}`),
          catchError(() => {
            this.networkForm.controls.consignor.setErrors({ parmaNotFound: v });
            return of(v);
          })
        );
      })
    );
  };

  formatShipFromValue = (parmaId: string) => {
    return this.listOfShipFrom$.pipe(
      filter(Boolean),
      map((shipFroms) => {
        const newValue = shipFroms?.find((shipFrom) => shipFrom.parmaId === parmaId)?.parmaName || parmaId;
        return newValue ? `${parmaId} - ${newValue}` : parmaId;
      })
    );
  };

  formatShipToValue = (parmaId: string) => {
    return this.listOfShipTo$.pipe(
      filter(Boolean),
      map((shipTos) => {
        const newValue = shipTos?.find((shipTo) => shipTo.parmaId === parmaId)?.parmaName || parmaId;
        return newValue ? `${parmaId} - ${newValue}` : parmaId;
      })
    );
  };

  formatConsignorValue = (parmaId: string) => {
    return this.lostOfConsignors$.pipe(
      filter(Boolean),
      map((consignors) => {
        const newValue = consignors?.find((consignor) => consignor.parmaId === parmaId)?.parmaName || parmaId;
        return newValue ? `${parmaId} - ${newValue}` : parmaId;
      })
    );
  };

  clearSearch = () => {
    this.searchFormControl.setValue('');
  };
}
