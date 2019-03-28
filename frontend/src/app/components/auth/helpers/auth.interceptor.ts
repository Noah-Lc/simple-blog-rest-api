import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { AuthService } from '../../../services/auth.service'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler){
        // add authorization header with auth token if available
        let authToken = this.authService.getToken();
        if (authToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Token ${authToken}`
                }
            });
        }

        return next.handle(request);
    }
}
