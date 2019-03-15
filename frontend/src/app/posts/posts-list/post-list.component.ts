import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../../models/post.model'
import { PostService } from '../../services/post.service'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit, OnDestroy{
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

  ngOnDestroy(){
    this.postSubscribe.unsubscribe();
  }
}
