import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, { data, width: '360px' });
    // MatDialog closes with `undefined` if dismissed via backdrop/Esc, not just Cancel —
    // normalize that to `false` so callers only ever deal with a real boolean.
    return new Observable<boolean>((subscriber) => {
      ref.afterClosed().subscribe((result) => {
        subscriber.next(!!result);
        subscriber.complete();
      });
    });
  }
}
