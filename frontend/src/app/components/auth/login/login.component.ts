import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { NgForm } from '@angular/forms';
import { Router} from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;

  isLoading: Boolean;
  isSubmited: Boolean;
  default_users = [
          {
            name: 'rebecca',
            email: 'rebecca@company.com',
            avatar: 'assets/avatars/avatar01.png',
          },
          {
            name: 'williams',
            email: 'williams@company.com',
            avatar: 'assets/avatars/avatar02.png',
          },
          {
            name: 'leo',
            email: 'leo@company.com',
            avatar: 'assets/avatars/avatar03.png',
          },
          {
            name: 'katherine',
            email: 'katherine@company.com',
            avatar: 'assets/avatars/avatar04.png',
          },
        ];

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    if (this.authService.getIsAuth()) {
      this.router.navigate(['dashboard']);
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(authenticated => {
        this.isLoading = false;
        if (authenticated) { this.router.navigate(['/dashboard']); }
    });
  }

  onLogin(loginForm: NgForm): void {
    this.isSubmited = true;

    if (loginForm.valid) {
      this.isLoading = true;
      this.authService.Login(loginForm.value.email, loginForm.value.password);
    }
  }

  onLoginWithDemoUser(email: string): void {
    this.authService.Login(email, 'demopwd123');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
