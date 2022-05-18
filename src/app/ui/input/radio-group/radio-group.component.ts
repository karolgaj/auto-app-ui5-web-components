import { AfterViewInit, Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomInputAbstract } from '../custom-input.abstract';
import { SelectionOption } from '../../../models/selection-option.model';

@UntilDestroy()
@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadioGroupComponent),
    },
  ],
})
export class RadioGroupComponent extends CustomInputAbstract implements AfterViewInit, OnInit {
  @Input()
  options: SelectionOption<any>[] = [];

  @Input()
  valueStateMessage?: string;

  formGroup?: FormGroup;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.formGroup = new FormGroup({
      radio: this.formControl,
    });
  }

  getId(): string {
    return `custom-radio-group-${this._id}`;
  }
}
