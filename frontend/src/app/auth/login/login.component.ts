import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'

import { User } from '../../models/user.model'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(public authService: AuthService){}

  onLogin(loginForm: NgForm){
    if(loginForm.invalid) return;
    this.authService.Login(loginForm.value.email, loginForm.value.password);
  }
}
