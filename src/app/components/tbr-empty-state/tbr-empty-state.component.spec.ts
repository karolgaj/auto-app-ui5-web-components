import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbrEmptyStateComponent } from './tbr-empty-state.component';

describe('TbrEmptyStateComponent', () => {
  let component: TbrEmptyStateComponent;
  let fixture: ComponentFixture<TbrEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbrEmptyStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbrEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
