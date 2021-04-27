import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  public openSnackBar(mensagem: string, time?: number): void {
    this.snackBar.open(mensagem, 'Ok', {
      duration: time ? time : 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}
