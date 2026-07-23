import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentFormComponent } from './shipment-form.component';

describe('ShipmentForm', () => {
  let component: ShipmentFormComponent;
  let fixture: ComponentFixture<ShipmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShipmentFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
