import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TbrService } from '../../services/tbr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { TbrLine } from '../../models/tbr-line.model';
import { Store } from '@ngrx/store';
import { selectedTbr } from '../../state/tbr.selectors';

@Component({
  selector: 'app-tbr-details',
  templateUrl: './tbr-details.component.html',
  styleUrls: ['./tbr-details.component.scss'],
})
export class TbrDetailsComponent implements OnInit, AfterViewInit {
  public details = this.store.select(selectedTbr);
  public addLineFormGroup = this.fb.group({
    partNo: this.fb.control(null, Validators.required),
    plannedQty: this.fb.control(null, Validators.required),
    poNumber: this.fb.control(null, Validators.required),    
  });
  public addRefFormGroup = this.fb.group({
    msgToCarrier: this.fb.control(null),
    pickupRef: this.fb.control(null),
    doNotMerge: this.fb.control(false),
  });

  @ViewChild('addLineDialog')
  public addLineDialog!: ElementRef;
  @ViewChild('partNo')
  public partNo!: ElementRef;
  @ViewChild('plannedQty')
  public plannedQty!: ElementRef;
  @ViewChild('poNumber')
  public poNumber!: ElementRef;

  @ViewChild('addReferencesDialog')
  public addReferencesDialog!: ElementRef;
  @ViewChild('msgToCarrier')
  public msgToCarrier!: ElementRef;
  @ViewChild('pickupRef')
  public pickupRef!: ElementRef;

  constructor(private router: Router, private tbrService: TbrService, private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // @ts-ignore
    fromEvent(this.partNo.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.addLineFormGroup.controls.partNo.setValue((e.target as HTMLInputElement).value)
    );
    // @ts-ignore
    fromEvent(this.plannedQty.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.addLineFormGroup.controls.plannedQty.setValue((e.target as HTMLInputElement).value)
    );
    // @ts-ignore
    fromEvent(this.poNumber.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.addLineFormGroup.controls.poNumber.setValue((e.target as HTMLInputElement).value)
    );
    // @ts-ignore
    fromEvent(this.msgToCarrier.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.addRefFormGroup.controls.msgToCarrier.setValue((e.target as HTMLInputElement).value)
    );
    // @ts-ignore
    fromEvent(this.pickupRef.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.addRefFormGroup.controls.pickupRef.setValue((e.target as HTMLInputElement).value)
    );
  }

  goBack() {
    this.router.navigate(['../']);
  }

  openAddDialog() {
    this.addLineDialog.nativeElement.show();
  }

  saveAddLine() {    
    console.log(this.addLineFormGroup.getRawValue());
    this.cancelAddLine();
  }

  cancelAddLine() {
    this.addLineDialog.nativeElement.close();
  }

  openAddRefDialog() {
    this.addReferencesDialog.nativeElement.show();
  }

  saveAddRef() {
    console.log(this.addRefFormGroup.getRawValue());
    this.cancelAddRef();
  }

  cancelAddRef() {
    this.addReferencesDialog.nativeElement.close();
  }

  navigateToThuDetails(line: TbrLine, shipitId: string) {
    this.router.navigate(['/', shipitId, line.articleNumber]);
  }
  split(){
    //add logic
    console.log("Split a line into two via an Interface in XTR MS")
  }

  log(e: any) {
    console.log(e);
  }

  goToWorkflow(shipitId: string) {
    this.router.navigate(['/workflow', shipitId]);
  }
}
