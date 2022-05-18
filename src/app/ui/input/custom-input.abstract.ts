import { AfterViewInit, Directive, ElementRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroupDirective, NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

let id = 0;

type ValueState = 'Success' | 'Error' | 'Warning' | 'None';

@Directive()
export abstract class CustomInputAbstract implements ControlValueAccessor, AfterViewInit, OnInit {
  @Input()
  inputClasses: string[] = [];

  @Input()
  inputContainerClasses: string[] = [];

  @Input()
  labelClasses: string[] = [];

  @Input()
  label!: string;

  @Input()
  placeholder = '';

  @Input()
  required = false;

  @Input()
  showColon = true;

  @Input()
  vertical = false;

  @Input()
  formatValue?: (value: any) => any;

  @ViewChild('customInput')
  customInput!: ElementRef;

  disabled = false;
  touched = false;

  formattedValue: any;

  value: any;
  formControl!: FormControl;

  protected _id: number;

  protected constructor(private injector?: Injector) {
    this._id = ++id;
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: any) => {
      const value = e.detail?.value ?? e.target.value;
      this.writeValue(value);
      this.onChange(this.value);
      this.markAsTouched();
    });
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

    this.formControl.valueChanges
      .pipe(
        filter((value) => value !== this.value),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.writeValue(value);
        this.onChange(this.value);
        this.markAsTouched();
      });
  }

  get valueState(): ValueState | null {
    if (this.disabled) {
      return 'None';
    }

    if (this.formControl?.touched) {
      return this.formControl.invalid ? 'Warning' : 'Success';
    }

    return 'None';
  }

  writeValue(value: any): void {
    this.formattedValue = this.formatValue ? this.formatValue(value) : value;
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

  onChange = (value: any) => {};
  onTouched = () => {};
}
