import { Component, OnInit, OnChanges, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.model'
import { ProfileService } from '../../services/profile.service'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy{
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  profile: User;
  private profileSubscribe: Subscription;

  constructor(public authService: AuthService, public profileService: ProfileService){}

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated =>{
        this.userIsAuthenticated = isAuthenticated;
      });
    this.profileService.getProfile();
    this.profileSubscribe = this.profileService.getPostsUpdateListener()
      .subscribe(profile =>{
        this.profile = profile[0];
    });
  }

  ngOnChanges(){
    console.log("test");
  }

   dropDown(){
     document.getElementById('myDropdown').classList.toggle('show');
   }

  logout(){
    this.authService.Logout();
    this.userIsAuthenticated = false;
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    this.profileSubscribe.unsubscribe();
  }
}
