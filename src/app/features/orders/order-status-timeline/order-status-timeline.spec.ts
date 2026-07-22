import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusTimelineComponent } from './order-status-timeline.component';

describe('OrderStatusTimeline', () => {
  let component: OrderStatusTimelineComponent;
  let fixture: ComponentFixture<OrderStatusTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusTimelineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderStatusTimelineComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
