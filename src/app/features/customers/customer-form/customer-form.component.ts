import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CustomerService } from '../customer.service';
import { ApiError } from '../../../shared/models/api-error.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-customer-form',
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
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private customerId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(/^$|^[+]?[0-9 ()-]{7,20}$/)],
    street: [''],
    city: [''],
    state: [''],
    postalCode: [''],
    country: [''],
    status: ['ACTIVE' as 'ACTIVE' | 'INACTIVE', Validators.required],
  });

  get isEditMode(): boolean {
    return this.customerId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.customerId = Number(idParam);
      this.customerService.getById(this.customerId).subscribe((customer) => {
        this.form.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone ?? '',
          street: customer.street ?? '',
          city: customer.city ?? '',
          state: customer.state ?? '',
          postalCode: customer.postalCode ?? '',
          country: customer.country ?? '',
          status: customer.status,
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const request = this.form.getRawValue();

    const save$ = this.isEditMode
      ? this.customerService.update(this.customerId!, request)
      : this.customerService.create(request);

    save$.subscribe({
      next: () => {
        this.snackbar.success(this.isEditMode ? 'Customer updated.' : 'Customer created.');
        this.router.navigate(['/customers']);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError | undefined;
        this.errorMessage.set(apiError?.message ?? 'Something went wrong. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
