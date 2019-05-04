import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(public authService: AuthService){}

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  logout(){
    this.authService.Logout();
    this.userIsAuthenticated = false;
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
