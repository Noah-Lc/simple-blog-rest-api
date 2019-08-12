import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router} from '@angular/router';

import { AuthService } from '../../../services/auth.service'
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loading: Boolean;
  private authListenerSubs: Subscription;
  public default_users = [
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

  constructor(public authService: AuthService, public router: Router){}

  ngOnInit(){
    if (this.authService.getIsAuth()) {
      this.router.navigate(['']);
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated =>{
        this.loading = isAuthenticated;
    });
  }

  onLogin(loginForm: NgForm){
    this.loading = true;
    if(!loginForm.invalid) {
      this.authService.Login(loginForm.value.email, loginForm.value.password);
    }
    return;
  }

  onLoginWithDemoUser(email :string){
    this.authService.Login(email, "demopwd123");
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
