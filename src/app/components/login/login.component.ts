import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Login } from './login';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Login = new Login();

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService,
  ) { }

  ngOnInit(): void {
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
