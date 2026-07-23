import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ShipmentService } from '../shipment.service';
import { ShippingCarrier } from '../shipment.model';
import { ApiError } from '../../../shared/models/api-error.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-shipment-form',
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
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.scss',
})
export class ShipmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly shipmentService = inject(ShipmentService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackbar = inject(SnackbarService);

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly carriers: ShippingCarrier[] = ['UPS', 'FEDEX', 'USPS', 'DHL', 'OTHER'];

  readonly form = this.fb.group({
    orderId: this.fb.control<number | null>(
      Number(this.route.snapshot.queryParamMap.get('orderId')) || null,
      Validators.required,
    ),
    carrier: this.fb.control<ShippingCarrier | null>(null, Validators.required),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    this.shipmentService.create({ orderId: raw.orderId!, carrier: raw.carrier! }).subscribe({
      next: () => {
        this.snackbar.success('Shipment created.');
        this.router.navigate(['/shipments']);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError | undefined;
        this.errorMessage.set(apiError?.message ?? 'Something went wrong. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
