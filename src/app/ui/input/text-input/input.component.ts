import { Component, Input } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';

type IconActions = {
  icon: string;
  action?: () => void;
};

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends CustomInputAbstract {
  @Input()
  icons: IconActions[] = [];

  @Input()
  showSuggestions = false;

  @Input()
  showColon = false;

  constructor() {
    super();
  }

  getId(): string {
    return `custom-input-${this._id}`;
  }
}
