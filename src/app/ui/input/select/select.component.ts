import { AfterViewInit, Component, forwardRef, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { fromEvent } from 'rxjs';
import { CustomInputAbstract } from '../custom-input.abstract';
import { SelectionOption } from '../../../models/selection-option.model';

@UntilDestroy()
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
})
export class SelectComponent extends CustomInputAbstract implements AfterViewInit {
  @Input()
  selectionOptions: SelectionOption<any>[] = [];

  @Input()
  valueStateMessage?: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      // @ts-ignore
      this.value = e.detail.selectedOption.value;
      this.onChange(this.value);
      this.markAsTouched();
    });
  }

  getId(): string {
    return `custom-select-${this._id}`;
  }
}
