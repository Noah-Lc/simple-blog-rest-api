import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Router} from '@angular/router';

import { AuthService } from '../../../services/auth.service'
import { AlertService } from './../../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

  constructor(public authService: AuthService, public router: Router, private alertService: AlertService){}

  ngOnInit(){
    if (this.authService.getIsAuth()) {
      this.router.navigate(['']);
    }
  }

  onLogin(loginForm: NgForm){
    if(loginForm.invalid) return;
    
    this.authService.Login(loginForm.value.email, loginForm.value.password);
  }

  onLoginWithDemoUser(email :string){
    this.authService.Login(email, "demopwd123");
  }
}
