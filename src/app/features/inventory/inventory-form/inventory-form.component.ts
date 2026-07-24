import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { InventoryService } from '../inventory.service';
import { ProductService } from '../../products/product.service';
import { Product } from '../../products/product.model';
import { ApiError } from '../../../shared/models/api-error.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-inventory-form',
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
  templateUrl: './inventory-form.html',
  styleUrl: './inventory-form.scss',
})
export class InventoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackbar = inject(SnackbarService);

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly products = signal<Product[]>([]);
  private recordId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    productId: [0, Validators.required],
    location: ['', [Validators.required, Validators.maxLength(100)]],
    quantityAvailable: [0, [Validators.required, Validators.min(0)]],
    quantityReserved: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.required, Validators.min(0)]],
  });

  get isEditMode(): boolean {
    return this.recordId !== null;
  }

  ngOnInit(): void {
    // Pull enough products to populate a dropdown. Fine at this project's scale —
    // a searchable/paginated picker would replace this once the product catalog grows large.
    this.productService.getAllForPicker().subscribe((products) => this.products.set(products));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.recordId = Number(idParam);
      this.inventoryService.getById(this.recordId).subscribe((record) => {
        this.form.patchValue({
          productId: record.productId,
          location: record.location,
          quantityAvailable: record.quantityAvailable,
          quantityReserved: record.quantityReserved,
          reorderLevel: record.reorderLevel,
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
      ? this.inventoryService.update(this.recordId!, request)
      : this.inventoryService.create(request);

    save$.subscribe({
      next: () => {
        this.snackbar.success(
          this.isEditMode ? 'Inventory record updated.' : 'Inventory record created.',
        );
        this.router.navigate(['/inventory']);
      },
      error: (err: HttpErrorResponse) => {
        const apiError = err.error as ApiError | undefined;
        this.errorMessage.set(apiError?.message ?? 'Something went wrong. Please try again.');
        this.saving.set(false);
      },
    });
  }
}
