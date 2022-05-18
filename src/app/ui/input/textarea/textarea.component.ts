import { Component, forwardRef, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomInputAbstract } from '../custom-input.abstract';

@UntilDestroy()
@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextareaComponent),
    },
  ],
})
export class TextareaComponent extends CustomInputAbstract {
  @Input()
  rows = 10;

  @Input()
  showSuggestions = false;

  constructor(injector: Injector) {
    super(injector);
  }

  getId(): string {
    return `custom-textarea-${this._id}`;
  }
}
