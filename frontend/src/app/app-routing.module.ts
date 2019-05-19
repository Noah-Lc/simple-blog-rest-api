import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './components/posts/posts-list/post-list.component';
import { PostCreateComponent } from './components/posts/posts-create/post-create.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { DocsComponent } from './components/pages/docs/docs.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';

import { AuthGuard } from './components/auth/helpers/auth.guard';

const routes: Routes = [
  { path: 'posts', component: PostListComponent },
  { path: 'post/:slug', component: PostDetailsComponent },
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PostCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
