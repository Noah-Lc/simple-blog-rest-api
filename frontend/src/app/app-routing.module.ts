import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './components/posts/posts-list/post-list.component';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { MainComponent } from './components/pages/main.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DocsComponent } from './components/pages/docs/docs.component';
import { LoginComponent } from './components/auth/login/login.component';

import { AuthGuard } from './components/auth/helpers/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/dashboard/profile/profile.component';
import { PostsEditorComponent } from './components/dashboard/posts-editor/posts-editor.component';

const routes: Routes = [
  { path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'posts', component: PostListComponent },
      { path: 'post/:slug', component: PostDetailsComponent },
      { path: 'docs', component: DocsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'posts', component: PostsEditorComponent }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
