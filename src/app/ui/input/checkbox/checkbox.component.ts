import { AfterViewInit, Component, forwardRef, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { CustomInputAbstract } from '../custom-input.abstract';

@UntilDestroy()
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
export class CheckboxComponent extends CustomInputAbstract implements AfterViewInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit() {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      this.value = (e.target as HTMLInputElement).checked;
      this.onChange(this.value);
      this.markAsTouched();
    });
  }

  getId(): string {
    return `custom-checkbox-${this._id}`;
  }
}
