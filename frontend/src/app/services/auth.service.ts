import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Config } from '../../config/configuration.config'
import { User } from '../models/user.model';

@Injectable({providedIn: 'root'})
export class AuthService{
  private strUrl = Config.URL;
  private token: string;

  constructor(private http: HttpClient) { }

  getToken(){
    return this.token;
  }

  createUser(name: string, email: string, password: string){
    let url = this.strUrl + 'profile/';
    const user: User = {name: name, email: email, password: password};
    this.http.post(url, user)
      .subscribe(response => {
        console.log(response);
      });
  }

  Login(email: string, password: string){
    let url = this.strUrl + 'login/';
    const user = {email: email, password: password};
    this.http.post<{token: string}>(url, user)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      });
  }
}
