import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ApiService} from '../api/api.service';
import {Observable} from 'rxjs';
import {Reajuste} from './reajuste';

@Injectable({
  providedIn: 'root'
})
export class ReajusteService {

  constructor(
    private authServie: AuthService,
    private http: HttpClient,
    private api: ApiService,
  ) { }

  public getAllReajustes(): Observable<Reajuste[]> {
    return this.http.get<Reajuste[]>(this.getApiUrl(), this.authServie.getTokenHeader());
  }

  private getApiUrl(): string {
    return this.api.BASE_API_URL + this.api.REAJUSTE_API_URL;
  }

}
