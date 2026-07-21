import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiError } from '../../../shared/models/api-error.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private productId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    // Mirrors backend: @Positive, @Digits(integer = 5, fraction = 2)
    price: [
      0,
      [Validators.required, Validators.min(0.01), Validators.pattern(/^\d{1,5}(\.\d{1,2})?$/)],
    ],
  });

  get isEditMode(): boolean {
    return this.productId !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.productId = Number(idParam);
      this.productsService.getById(this.productId).subscribe((product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
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
      ? this.productsService.update(this.productId!, request)
      : this.productsService.create(request);

    save$.subscribe({
      next: () => {
        this.snackbar.success(this.isEditMode ? 'Product updated.' : 'Product created.');
        this.router.navigate(['/products']);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError | undefined;
        this.errorMessage.set(apiError?.message ?? 'Something went wrong. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
