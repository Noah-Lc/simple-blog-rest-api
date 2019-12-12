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
  profile: User;
  private profileSubscribe: Subscription;

  constructor(public profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getProfile();
    this.profileSubscribe = this.profileService.getPostsUpdateListener()
    .subscribe(profile => {
      this.profile = profile[0];
    });
  }

  ngOnDestroy() {
    this.profileSubscribe.unsubscribe();
  }

  getRoleProfile() {
    if (this.profile.is_superuser) { return 'Super User'; } else if (this.profile.is_superuser) { return 'Staff User'; } else { return 'Active User'; }
  }
}
