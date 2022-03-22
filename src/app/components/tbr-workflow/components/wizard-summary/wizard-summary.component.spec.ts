import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardSummaryComponent } from './wizard-summary.component';

describe('WizardSummaryComponent', () => {
  let component: WizardSummaryComponent;
  let fixture: ComponentFixture<WizardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
