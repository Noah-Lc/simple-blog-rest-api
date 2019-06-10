import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import {RequestOptions } from '@angular/http';

import { Post } from '../models/post.model';

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: Post[] = [];
  private post: Post;
  private postsUpdate = new Subject<any>();

  constructor(private http: HttpClient) { }

  //Get all posts
  getPosts(){
    let url = 'api/posts/post/';
    this.http.get<Post[]>(url)
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdate.next([...this.posts]);
    });
  }

  //Get feature posts
  getFeaturePosts(){
    let url = 'api/posts/feature/';
    this.http.get<Post[]>(url)
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdate.next([...this.posts]);
    });
  }

  //Get a post by ID
  getPost(slug: string) {
    const url = 'api/posts/post/' + slug;
    this.http.get<Post>(url)
    .subscribe((postData) => {
      this.post = postData;
      this.postsUpdate.next([this.post]);
    });
  }

  //Add a post
  addPosts(title: string, content: string, image: File, category: string, tags: any){
    let url = 'api/posts/post/';
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("image", image);

    const post: Post = {title:title, content:content, image: image, category:category, tags:tags};

    this.http.post(url, formData)
    .subscribe(responseData => {
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
    });
  }

  getPostsUpdateListener(){
    return this.postsUpdate.asObservable();
  }
}
