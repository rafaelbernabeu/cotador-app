import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {Usuario} from '../auth/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  fazerLogin(): void {
    this.authService.fazerLogin(this.usuario).subscribe(
      next => {
        alert('Sucesso!');
      },
      error => {
        alert('Dados nao conferem');
        this.usuario.email = 'errou seu noom';
        this.usuario.password = '';
      }
    );
  }

}
