import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model'
import { PostService } from '../../../services/post.service'

import { octicon } from 'octicons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  posts: Post[] = [];
  private postSubscribe: Subscription;

  constructor(public postService: PostService){}

  ngOnInit(){
    this.postService.getPosts();
    this.postSubscribe = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) =>{
        this.posts = posts;
      });
  }

  checked(){
    console.log("test");
  }

  ngOnDestroy(){
    this.postSubscribe.unsubscribe();
  }
}
