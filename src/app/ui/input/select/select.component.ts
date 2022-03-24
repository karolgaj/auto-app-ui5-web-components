import { Component, forwardRef, Input } from '@angular/core';
import { CustomInputAbstract } from '../custom-input.abstract';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectionOption } from '../../../models/selection-option.model';
import { fromEvent } from 'rxjs';

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
export class SelectComponent extends CustomInputAbstract {
  @Input()
  selectionOptions: SelectionOption<any>[] = [];

  @Input()
  valueState?: 'Success' | 'Warning' | 'Error' | 'Information';

  @Input()
  valueStateMessage?: string;

  constructor() {
    super();
  }

  getId(): string {
    return `custom-select-${this._id}`;
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) => {
      // @ts-ignore
      this.value = e.detail.selectedOption.value;
      this.onChange(this.value);
    });
  }
}
