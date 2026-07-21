import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersListComponent } from './customer-list.component';

describe('CustomersList', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
