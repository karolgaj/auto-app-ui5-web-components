import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @ViewChild('dialog')
  dialog!: ElementRef;

  @Output()
  save = new EventEmitter<void>();

  @Output()
  close = new EventEmitter<void>();

  @Input()
  accessibleName!: string;

  @Input()
  dialogHeader?: string;

  @Input()
  hideDefaultFooter = false;

  closeDialog(): void {
    this.dialog.nativeElement.close();
  }

  openDialog(): void {
    this.dialog.nativeElement.show();
  }
}
