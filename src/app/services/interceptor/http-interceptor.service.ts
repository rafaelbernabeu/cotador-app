import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {SnackbarService} from "../snackbar/snackbar.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackService: SnackbarService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        if (evt instanceof HttpResponse) {

        }
      },
      err => {
        if(err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 403:
              this.snackService.openSnackBar('Usuário sem permissão de acesso ao recurso solicitado!', 5000);
              this.router.navigate(['/home']);
              break;

            case 500:
              this.snackService.openSnackBar(err.error, 10000);
              console.log(err);
              break;

            default:
              console.log(err);
              break;
          }
        }
      })
    );
  }
}
