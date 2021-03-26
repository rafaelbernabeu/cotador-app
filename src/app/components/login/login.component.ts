import {Component, Inject, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Usuario } from '../../services/usuario/usuario';
import { Geolocation } from "../../services/usuario/geolocation";
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usuario: Usuario = new Usuario();

  constructor(
    @Inject('Navigator') private navigator: Navigator,

    private router: Router,
    private authService: AuthService,
    private snackBar: SnackbarService,
  ) { }

  ngOnInit(): void {
    if (this.authService.isUsuarioAutenticado()) {
      this.router.navigate(['/home']);
    }
  }

  fazerLogin(): void {
    this.navigator.geolocation.getCurrentPosition(
      position => this.login(position),
      errorLocaltion => {
        this.snackBar.openSnackBar("Sem permissao de acesso a localizaçao.");
        this.login();
      }
    );
  }

  login(geolocarion?: GeolocationPosition): void {
    this.usuario.geolocation = geolocarion ? new Geolocation(geolocarion.coords) : new Geolocation();
    this.authService.fazerLogin(this.usuario).subscribe(
      sucessoLogin => {
        this.snackBar.openSnackBar('Login efetuado com sucesso!');
        this.router.navigate(['/home']);
      },
      erroLogin => {
        this.snackBar.openSnackBar('Dados nao conferem!');
        this.usuario.email = '';
        this.usuario.password = '';
      }
    );
  }
}
