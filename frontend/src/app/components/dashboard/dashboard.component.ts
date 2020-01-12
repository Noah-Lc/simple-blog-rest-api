import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private profileSubscribe: Subscription;

  userProfile: User;
  currentPath: string;
  dashboardMenu: any;

  constructor(public authService: AuthService, public profileService: ProfileService, public router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.url.subscribe(() => {
      const path = this.router.snapshot.firstChild.routeConfig.path;
      this.currentPath = path ? path : 'home';
    });
    this.profileService.getProfile();
    this.profileSubscribe = this.profileService.getPostsUpdateListener()
    .subscribe(profile => {
      this.userProfile = profile;
      this.initDashboard(profile);
    });
  }

  ngOnDestroy() {
    this.profileSubscribe.unsubscribe();
  }

  initDashboard(user: User) {
    this.dashboardMenu = [
      { name: 'Dsahboard', icon: 'home', action: 'home', valid: true },
      { name: 'Profile', icon: 'home', action: 'profile', valid: true },
      { name: 'Posts', icon: 'home', action: 'posts', valid: true },
      { name: 'Notification', icon: 'home', action: 'notification', valid: user.is_staff },
      { name: 'Admin', icon: 'home', action: 'admin', valid: user.is_superuser },
    ];
  }

  logout() {
    this.authService.Logout();
  }
}
