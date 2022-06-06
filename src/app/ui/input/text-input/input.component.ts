import { Component, forwardRef, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomInputAbstract } from '../custom-input.abstract';

type IconActions = {
  icon: string;
  action?: () => void;
};

@UntilDestroy()
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
})
export class InputComponent extends CustomInputAbstract {
  @Input()
  icons: IconActions[] = [];

  @Input()
  showSuggestions = false;

  constructor(injector: Injector) {
    super(injector);
  }

  getId(): string {
    return `custom-input-${this._id}`;
  }
}
