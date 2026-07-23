import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../payment.service';
import { PaymentMethod } from '../payment.model';
import { ApiError } from '../../../shared/models/api-error.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss',
})
export class PaymentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackbar = inject(SnackbarService);

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly methods: PaymentMethod[] = [
    'CREDIT_CARD',
    'DEBIT_CARD',
    'PAYPAL',
    'BANK_TRANSFER',
    'CASH_ON_DELIVERY',
  ];

  readonly form = this.fb.group({
    // Pre-fill orderId if we arrived via a "Pay for this order" link (?orderId=123)
    orderId: this.fb.control<number | null>(
      Number(this.route.snapshot.queryParamMap.get('orderId')) || null,
      Validators.required,
    ),
    amount: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    method: this.fb.control<PaymentMethod | null>(null, Validators.required),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    this.paymentService
      .create({ orderId: raw.orderId!, amount: raw.amount!, method: raw.method! })
      .subscribe({
        next: () => {
          this.snackbar.success('Payment recorded.');
          this.router.navigate(['/payments']);
        },
        error: (err: HttpErrorResponse) => {
          const apiError = err.error as ApiError | undefined;
          this.errorMessage.set(apiError?.message ?? 'Something went wrong. Please try again.');
          this.saving.set(false);
        },
      });
  }
}
