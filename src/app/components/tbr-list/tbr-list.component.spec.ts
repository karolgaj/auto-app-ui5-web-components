import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbrListComponent } from './tbr-list.component';

describe('TbrListComponent', () => {
  let component: TbrListComponent;
  let fixture: ComponentFixture<TbrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TbrListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
