import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler){
        // auto logout if 401 response returned from api
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    this.authService.Logout();
                }
                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}
