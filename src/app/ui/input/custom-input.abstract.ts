import { AfterViewInit, Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

let id = 0;

type NgClasses = string[] | { [key: string]: boolean };

@UntilDestroy()
@Directive()
export abstract class CustomInputAbstract implements ControlValueAccessor, AfterViewInit {
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
  showColon = true;

  onChange: any = () => {};
  onTouched: any = () => {};
  disabled = false;

  value: any;
  protected _id: number;

  protected constructor() {
    this._id = ++id;
  }

  abstract getId(): string;

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      this.value = (e.target as HTMLInputElement).value;
      this.onChange(this.value);
    });
  }
}
