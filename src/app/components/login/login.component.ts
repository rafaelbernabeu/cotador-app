import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Login } from './login';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Login = new Login();

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  fazerLogin(): void {
    this.authService.fazerLogin(this.usuario).subscribe(
      next => {
        this.openSnackBar('Sucesso!');
        this.router.navigate(['/home']);
      },
      error => {
        this.openSnackBar('Dados nao conferem');
        this.usuario.email = '';
        this.usuario.password = '';
      }
    );
  }

  private openSnackBar(mensagem: string): void {
    this.snackBar.open(mensagem, 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}
