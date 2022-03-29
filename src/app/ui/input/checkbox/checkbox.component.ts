import { Component, forwardRef, Injector } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent),
    },
  ],
})
export class CheckboxComponent extends CustomInputAbstract {
  constructor(injector: Injector) {
    super(injector);
  }

  getId(): string {
    return `custom-checkbox-${this._id}`;
  }

  ngAfterViewInit() {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      this.value = (e.target as HTMLInputElement).checked;
      this.onChange(this.value);
      this.markAsTouched();
    });
  }
}
