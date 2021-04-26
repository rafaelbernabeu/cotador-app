import {Component} from '@angular/core';
import {AuthService} from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cotador-app';

  constructor(
    public authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  isUsrAdmin(): boolean {
    return this.authService.isUsrAdmin();
  }

  isUsrVendedor(): boolean {
    return this.authService.isUsrVendedor();
  }

  isUsrOperador(): boolean {
    return this.authService.isUsrOperador();
  }

  isUsrPosVendas(): boolean {
    return this.authService.isUsrPosVendas();
  }

}
