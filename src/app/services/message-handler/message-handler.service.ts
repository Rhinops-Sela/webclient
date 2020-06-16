import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageHandlerService {
  public onErrorOccured: Subject<string> = new Subject<string>();
  public onActionCompleted: Subject<string> = new Subject<string>();
  constructor(private snackBar: MatSnackBar) {
    this.onErrorOccured.subscribe((errorMessage: string) => {
      this.openSnackBar(errorMessage);
    });
    this.onActionCompleted.subscribe((message: string) => {
      this.openSnackBar(message);
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'dissmis', {
      duration: 5000,
    });
  }
}
