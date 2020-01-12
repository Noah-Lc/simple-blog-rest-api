import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user.model';

import { AlertService } from './../services/alert.service';

@Injectable({providedIn: 'root'})
export class AuthService {
  private authStatusListener = new Subject<boolean>();

  private isAuthenticated = false;
  private currentToken: string;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  getToken() {
    return this.currentToken;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(name: string, email: string, avatar: any, password: string) {
    const url = 'api/profile/';
    const user: User = {name: name, email: email, avatar: avatar, password: password};
    this.http.post(url, user)
      .subscribe(response => {

    });
  }

  Login(email: string, password: string) {
    const url = 'api/login/';
    const user = {email: email, password: password};

    this.http.post<{token: string}>(url, user)
      .subscribe(response => {
        const token = response.token;
        this.currentToken = token;
        if (token) {
          this.setAuthTimer(3600);
          this.saveAuthData(token);

          this.authStatusListener.next(true);
          this.isAuthenticated = true;
        }
      }, (error: any) => {
        this.authStatusListener.next(false);
        this.alertService.error('Username or password is incorrect');
      }
    );
  }

  Logout() {
    this.isAuthenticated = false;
    this.currentToken = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const dateNow = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - dateNow.getTime();

    if (expiresIn > 0) {
      this.currentToken = authInformation.token;
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

    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (token || expirationDate) {
      return {token: token, expirationDate: new Date(expirationDate)};
    }
    return;
  }
}
