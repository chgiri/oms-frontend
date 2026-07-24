import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../order.service';
import {
  ADMIN_OVERRIDE_TRANSITIONS,
  ALLOWED_MANUAL_TRANSITIONS,
  Order,
  OrderStatus,
} from '../order.model';
import { OrderStatusTimelineComponent } from '../order-status-timeline/order-status-timeline.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../shared/models/api-error.model';
import { interval, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { getAllowedTransitions } from '../../../shared/models/status-workflow.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    OrderStatusTimelineComponent,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);
  private readonly snackbar = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  readonly order = signal<Order | null>(null);
  readonly updating = signal(false);
  readonly displayedColumns = ['productName', 'quantity', 'unitPrice', 'subtotal'];
  selectedNextStatus: OrderStatus | null = null;

  get availableTransitions(): OrderStatus[] {
    const current = this.order()?.status;
    return current ? getAllowedTransitions(ALLOWED_MANUAL_TRANSITIONS, current) : [];
  }

  get adminOverrideTransitions(): OrderStatus[] {
    const current = this.order()?.status;
    if (!current || !this.authService.hasRole('ADMIN')) return [];
    return ADMIN_OVERRIDE_TRANSITIONS[current] ?? [];
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder(id);
    this.pollForUpdates(id);
  }

  private pollForUpdates(id: number): void {
    interval(4000)
      .pipe(
        switchMap(() => this.orderService.getById(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((latest) => {
        const isTerminal = latest.status === 'DELIVERED' || latest.status === 'CANCELLED';
        if (!this.updating()) {
          this.order.set(latest);
        }
        // Nothing unsubscribes the interval() here on terminal state — harmless
        // (it'll just keep confirming "still DELIVERED" every 4s) but worth
        // knowing as a small inefficiency, not a correctness bug.
      });
  }

  loadOrder(id: number): void {
    this.orderService.getById(id).subscribe((order) => this.order.set(order));
  }

  applyOverride(status: OrderStatus): void {
    this.selectedNextStatus = status;
    this.applyStatusChange();
  }

  applyStatusChange(): void {
    const current = this.order();
    if (!current || !this.selectedNextStatus) return;

    this.updating.set(true);
    this.orderService.updateStatus(current.id!, this.selectedNextStatus).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.selectedNextStatus = null;
        this.snackbar.success('Order status updated.');
        this.updating.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError | undefined;
        this.snackbar.error(apiError?.message ?? 'Failed to update order status.');
        this.updating.set(false);
        // Our snapshot was wrong — the backend just told us so. Resync immediately
        // rather than leaving the UI showing a status that's already invalid.
        this.loadOrder(current.id!);
      },
    });
  }
}
