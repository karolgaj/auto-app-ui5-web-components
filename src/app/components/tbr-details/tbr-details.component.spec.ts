import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbrDetailsComponent } from './tbr-details.component';

describe('TbrDetailsComponent', () => {
  let component: TbrDetailsComponent;
  let fixture: ComponentFixture<TbrDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbrDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
