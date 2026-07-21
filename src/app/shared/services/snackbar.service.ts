import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Service()
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 3000, panelClass: 'snackbar-success' });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 5000, panelClass: 'snackbar-error' });
  }
}
