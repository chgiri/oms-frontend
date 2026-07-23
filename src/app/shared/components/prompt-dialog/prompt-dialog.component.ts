import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

export interface PromptDialogData {
  title: string;
  label: string;
  optional?: boolean;
}

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
  ],
  templateUrl: './prompt-dialog.html',
  styleUrl: './prompt-dialog.scss',
})
export class PromptDialogComponent {
  readonly data = inject<PromptDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PromptDialogComponent>);

  value = '';

  confirm(): void {
    this.dialogRef.close(this.value || null);
  }

  skip(): void {
    this.dialogRef.close(null);
  }
}
