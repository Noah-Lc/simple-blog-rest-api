import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.getIsAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
