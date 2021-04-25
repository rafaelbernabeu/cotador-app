import {Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";
import {Cotacao} from "./cotacao";

@Injectable({
  providedIn: 'root'
})
export class CotacaoService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public recuperaCotacao(id: number): Observable<Cotacao> {
    return this.http.get<Cotacao>(this.getApiUrl() + '/' + id, this.authServie.getTokenHeader());
  }

  public geraCotacao(cotacao: Cotacao): Observable<Cotacao> {
    return this.http.post<Cotacao>(this.getApiUrl(), cotacao, this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.COTACAO_API_URL;
  }
}
