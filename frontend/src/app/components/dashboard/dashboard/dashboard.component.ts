import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'

import { User } from '../../../models/user.model'
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit{
  constructor(public authService: AuthService){}

  ngOnInit(){
    console.log(this.authService.getIsAuth());
  }
}
