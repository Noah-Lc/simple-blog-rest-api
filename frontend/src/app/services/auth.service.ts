import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'

import { User } from '../models/user.model';

@Injectable({providedIn: 'root'})
export class AuthService{
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router:Router) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, password: string){
    let url = 'api/profile/';
    const user: User = {name: name, email: email, password: password};
    this.http.post(url, user)
      .subscribe(response => {
        console.log(response);
      });
  }

  Login(email: string, password: string){
    let url = 'api/login/';
    const user = {email: email, password: password};
    this.http.post<{token: string}>(url, user)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token){
          this.isAuthenticated = true;
          this.router.navigate(['/dashboard']);
          this.authStatusListener.next(true);
        }
      });
  }

  Logout(){
    this.isAuthenticated = false;
    this.token = null;
    this.router.navigate(['/']);
  }


}
