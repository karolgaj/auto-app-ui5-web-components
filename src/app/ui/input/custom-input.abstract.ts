import { AfterViewInit, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';
import { fromEvent } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

let id = 0;

type NgClasses = string[] | { [key: string]: boolean };

@UntilDestroy()
@Directive()
export abstract class CustomInputAbstract implements AfterViewInit {
  @ViewChild('customInput')
  customInput!: ElementRef;

  @Input()
  inputClasses: NgClasses = [];

  @Input()
  inputContainerClasses: NgClasses = [];

  @Input()
  labelClasses: NgClasses = [];

  @Input()
  label!: string;

  @Input()
  placeholder!: string;

  @Input()
  required = false;

  @Input()
  control!: AbstractControl | IAbstractControl<any>;

  protected _id: number;

  protected constructor() {
    this._id = ++id;
  }

  abstract getId(): string;

  ngAfterViewInit(): void {
    if (!this.control) {
      return;
    }
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.control.setValue((e.target as HTMLInputElement).value)
    );

    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.customInput.nativeElement.value = value;
    });
  }
}
