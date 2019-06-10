import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'

import { User } from '../../../models/user.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  constructor(public authService: AuthService){}

  onRegister(registerForm: NgForm){
    if(registerForm.invalid) return;
    this.authService.createUser(registerForm.value.name, registerForm.value.email, null, registerForm.value.password);
  }
}
