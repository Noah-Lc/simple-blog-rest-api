import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Subscription } from 'rxjs';
import { Post } from '../../models/post.model'
import { PostService } from '../../services/post.service'

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html'
})
export class PostDetailsComponent implements OnInit, OnDestroy{
  post: Post;
  private postSubscribe: Subscription;

  constructor(public postService: PostService, public route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      let postId = paramMap.get('slug');

      this.postService.getPost(postId);
      this.postSubscribe = this.postService.getPostsUpdateListener()
        .subscribe(post =>{
          this.post = post[0];
        });
    });
  }

  ngOnDestroy(){
    this.postSubscribe.unsubscribe();
  }
}
