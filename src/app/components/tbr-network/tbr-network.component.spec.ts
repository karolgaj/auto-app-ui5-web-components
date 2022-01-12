import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbrNetworkComponent } from './tbr-network.component';

describe('TbrNetworkComponent', () => {
  let component: TbrNetworkComponent;
  let fixture: ComponentFixture<TbrNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbrNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbrNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
