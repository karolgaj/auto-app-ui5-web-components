import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { IAbstractControl } from '@rxweb/types/reactive-form/i-abstract-control';

type IconActions = {
  icon: string;
  action: () => void;
};

let id = 0;

type NgClasses = string[] | { [key: string]: boolean };

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements AfterViewInit {
  @ViewChild('customInput')
  customInput!: ElementRef;

  @Input()
  inputClasses: NgClasses = [];

  @Input()
  inputContainerClasses: NgClasses = [];

  @Input()
  labelClasses: NgClasses = [];

  @Input()
  label!: string;

  @Input()
  placeholder!: string;

  @Input()
  icons: IconActions[] = [];

  @Input()
  required = false;

  @Input()
  showSuggestions = false;

  @Input()
  showColon = false;

  @Input()
  control!: IAbstractControl<any>;

  get id(): string {
    return `custom-input-${id}`;
  }

  constructor() {
    id++;
  }

  ngAfterViewInit(): void {
    if (!this.control) {
      return;
    }
    // @ts-ignore
    fromEvent(this.customInput.nativeElement, 'change').subscribe((e: InputEvent) =>
      this.control.setValue((e.target as HTMLInputElement).value)
    );
  }
}
