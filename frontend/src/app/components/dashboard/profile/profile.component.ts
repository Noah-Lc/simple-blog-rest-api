import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../../models/user.model';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private profileSubscribe: Subscription;

  userProfile: User;
  currentRole: string;

  constructor(public profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile();
    this.profileSubscribe = this.profileService.getPostsUpdateListener()
    .subscribe(profile => {
      this.userProfile = profile;
      this.currentRole = this.getRoleProfile(profile);
    });
  }

  ngOnDestroy() {
    this.profileSubscribe.unsubscribe();
  }

  private getRoleProfile(user: User) {
    if (user.is_superuser) {
      return 'Super User';
    } else if (user.is_superuser) {
      return 'Staff User';
    } else {
      return 'Active User';
    }
  }
}
