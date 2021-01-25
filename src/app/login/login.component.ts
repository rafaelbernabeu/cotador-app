import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../auth/usuario';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
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
