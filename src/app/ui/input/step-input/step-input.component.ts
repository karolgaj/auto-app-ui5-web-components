import { AfterViewInit, Component, forwardRef, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { CustomInputAbstract } from '../custom-input.abstract';

@UntilDestroy()
@Component({
  selector: 'app-step-input',
  templateUrl: './step-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StepInputComponent),
    },
  ],
})
export class StepInputComponent extends CustomInputAbstract implements AfterViewInit {
  @Input() showSuggestions = false;
  @Input() valuePrecision: number | null = null;
  @Input() step: number | null = null;
  @Input() max: number | null = null;
  @Input() min: number | null = null;

  constructor(injector: Injector) {
    super(injector);
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

  getId(): string {
    return `custom-step-input-${this._id}`;
  }
}
