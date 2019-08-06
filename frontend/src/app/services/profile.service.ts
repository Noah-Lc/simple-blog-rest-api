import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'

import { User } from '../models/user.model';
import { AuthService } from './auth.service'

@Injectable({providedIn: 'root'})
export class ProfileService{
  private profile: User;
  private profileUpdate = new Subject<User[]>();

  constructor(private http: HttpClient, public authService: AuthService,) { }

  //Get profile of current user
  getProfile(){
    if (this.authService.getIsAuth()) {
      let url = 'api/update/';
      this.http.get<User>(url)
      .subscribe((postData) => {
        this.profile = postData;
        this.profileUpdate.next([this.profile]);
      });
    }
  }

  getPostsUpdateListener(){
    return this.profileUpdate.asObservable();
  }
}
