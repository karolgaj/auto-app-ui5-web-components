import { Component, forwardRef, Input } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

type IconActions = {
  icon: string;
  action?: () => void;
};

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
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

  constructor() {
    super();
  }

  getId(): string {
    return `custom-input-${this._id}`;
  }
}
