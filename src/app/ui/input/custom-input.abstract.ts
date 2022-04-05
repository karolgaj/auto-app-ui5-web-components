import { AfterViewInit, Directive, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

let id = 0;

type ValueState = 'Success' | 'Error';

@UntilDestroy()
@Directive()
export abstract class CustomInputAbstract implements ControlValueAccessor, AfterViewInit, OnInit {
  @ViewChild('customInput')
  customInput!: ElementRef;

  @Input()
  inputClasses: string[] = [];

  @Input()
  inputContainerClasses: string[] = [];

  @Input()
  labelClasses: string[] = [];

  @Input()
  label!: string;

  @Input()
  placeholder: string = '';

  @Input()
  required = false;

  @Input()
  showColon = true;

  @Input()
  vertical = false;

  @Input()
  formatValue?: (value: any) => any;

  onChange = (value: any) => {};
  onTouched = () => {};
  disabled = false;
  touched = false;

  formattedValue!: any;

  value: any;
  formControl!: FormControl;

  protected _id: number;

  protected constructor(private injector?: Injector) {
    this._id = ++id;
  }

  ngOnInit(): void {
    if (this.injector == null) {
      return;
    }
    const ngControl = this.injector.get(NgControl);

    if (ngControl instanceof FormControlName) {
      this.formControl = this.injector.get(FormGroupDirective).getControl(ngControl);
    } else {
      this.formControl = (ngControl as FormControlDirective).form as FormControl;
    }
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      this.value = (e.target as HTMLInputElement).value;
      this.formattedValue = this.formatValue ? this.formattedValue(this.value) : this.value;
      this.onChange(this.value);
      this.markAsTouched();
    });
  }

  get valueState(): ValueState | null {
    if (this.disabled) {
      return null;
    }

    if (this.formControl?.touched) {
      return this.formControl.invalid ? 'Error' : 'Success';
    }
    return null;
  }

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

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  abstract getId(): string;
}
