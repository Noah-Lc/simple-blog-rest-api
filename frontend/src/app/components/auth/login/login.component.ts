import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'

import { User } from '../../../models/user.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
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

  constructor(public authService: AuthService){}

  onLogin(loginForm: NgForm){
    if(loginForm.invalid) return;
    this.authService.Login(loginForm.value.email, loginForm.value.password);
  }

  onLoginWithDemoUser(email :string){
    this.authService.Login(email, "demopwd123");
  }


}
