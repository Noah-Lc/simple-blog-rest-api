import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './components/auth/helpers/auth.interceptor';
import { ErrorInterceptor } from './components/auth/helpers/error.interceptor';

import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

import { PostListComponent } from './components/posts/posts-list/post-list.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { PagesComponent } from './components/pages/pages.component';
import { AboutComponent } from './components/pages/about/about.component';
import { DocsComponent } from './components/pages/docs/docs.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { AlertComponent } from './components/alert/alert.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostDetailsComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PagesComponent,
    AboutComponent,
    DocsComponent,
    DashboardComponent,
    ProfileComponent,
    AlertComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
