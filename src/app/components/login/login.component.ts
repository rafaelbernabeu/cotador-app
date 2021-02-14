import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Usuario } from '../../services/usuario/usuario';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService,
  ) { }

  ngOnInit(): void {
    if (this.authService.existeTokenStorage()) {
      this.router.navigate(['/home']);
    }
  }

  fazerLogin(): void {
    this.authService.fazerLogin(this.usuario).subscribe(
      next => {
        this.snackBar.openSnackBar('Sucesso!');
        this.router.navigate(['/home']);
      },
      error => {
        this.snackBar.openSnackBar('Dados nao conferem');
        this.usuario.email = '';
        this.usuario.password = '';
      }
    );
  }



}
