import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { HomeComponent } from './components/home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { EntidadeComponent } from './components/entidade/entidade.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ProfissaoComponent } from './components/profissao/profissao.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsuarioComponent,
    EntidadeComponent,
    ProfissaoComponent
  ],
  imports: [
    FormsModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    HttpClientModule,
    MatDividerModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
