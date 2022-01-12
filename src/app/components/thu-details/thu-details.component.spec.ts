import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThuDetailsComponent } from './thu-details.component';

describe('ThuDetailsComponent', () => {
  let component: ThuDetailsComponent;
  let fixture: ComponentFixture<ThuDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThuDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
