import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  nomeUsuario: string;
  rolesUsuario: string[]

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.nomeUsuario = this.authService.getNomeUsuarioAutenticado();
    this.rolesUsuario = this.authService.getRolesUsuarioAutenticado();
  }

}
