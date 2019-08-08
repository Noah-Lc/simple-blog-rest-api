import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http'

import { User } from '../models/user.model';

import { AlertService } from './../services/alert.service';

@Injectable({providedIn: 'root'})
export class AuthService{
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router:Router, private alertService: AlertService) { }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, avatar: any, password: string){
    let url = 'api/profile/';
    const user: User = {name: name, email: email, avatar: avatar, password: password};
    this.http.post(url, user)
      .subscribe(response => {
        
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
          this.setAuthTimer(3600);
          this.saveAuthData(token);

          this.authStatusListener.next(true);
          this.isAuthenticated = true;

          this.router.navigate(['/dashboard']);
        }
      }, (error: any) => {
        this.alertService.error(error);
      }
    );
  }

  Logout(){
    this.isAuthenticated = false;
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation)
      return;

    const dateNow = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - dateNow.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.Logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 3600 * 1000);

    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (token || expirationDate) {
      return {token: token, expirationDate: new Date(expirationDate)}
    }
    return;
  }
}
