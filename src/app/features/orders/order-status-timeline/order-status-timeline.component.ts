import { Component, computed, input } from '@angular/core';
import { ORDER_STATUS_FLOW, OrderStatus } from '../order.model';

@Component({
  selector: 'app-order-status-timeline',
  standalone: true,
  templateUrl: './order-status-timeline.html',
  styleUrl: './order-status-timeline.scss',
})
export class OrderStatusTimelineComponent {
  readonly status = input.required<OrderStatus>();

  readonly isCancelled = computed(() => this.status() === 'CANCELLED');
  readonly steps = ORDER_STATUS_FLOW;

  readonly currentIndex = computed(() => {
    if (this.isCancelled()) return -1;
    return this.steps.indexOf(this.status());
  });

  stepState(index: number): 'done' | 'current' | 'upcoming' {
    if (index < this.currentIndex()) return 'done';
    if (index === this.currentIndex()) return 'current';
    return 'upcoming';
  }
}
