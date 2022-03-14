import { AfterViewInit, Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { CustomInputAbstract } from '../custom-input.abstract';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent extends CustomInputAbstract implements AfterViewInit {
  constructor() {
    super();
  }

  getId(): string {
    return `custom-checkbox-${this._id}`;
  }

  ngAfterViewInit() {
    if (!this.control) {
      return;
    }
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.control.setValue((e.target as HTMLInputElement).checked)
    );

    this.control.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      this.customInput.nativeElement.checked = value;
    });
  }
}
