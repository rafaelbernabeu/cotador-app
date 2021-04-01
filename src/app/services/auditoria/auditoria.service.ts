import {Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";
import {AuditoriaLogin} from "./auditoria-login";
import {AuditoriaCotacao} from "./auditoria-cotacao";
import {AuditoriaAlteracao} from "./auditoria-alteracao";

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllLogins(): Observable<AuditoriaLogin[]> {
    return this.http.get<AuditoriaLogin[]>(this.getLoginApiUrl(), this.authServie.getTokenHeader());
  }

  public getAllCotacoes(): Observable<AuditoriaCotacao[]> {
    return this.http.get<AuditoriaCotacao[]>(this.getCotacaoApiUrl(), this.authServie.getTokenHeader());
  }

  public getAllAlteracoes(): Observable<AuditoriaAlteracao[]> {
    return this.http.get<AuditoriaAlteracao[]>(this.getAlteracaoApiUrl(), this.authServie.getTokenHeader());
  }

  private getLoginApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_LOGIN_API_URL;
  }

  private getCotacaoApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_COTACAO_API_URL;
  }

  private getAlteracaoApiUrl(): string {
    return this.api.BASE_API_URL + this.api.AUDIT_ALTERACAO_API_URL;
  }

}
