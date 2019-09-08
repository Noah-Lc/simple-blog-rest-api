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

  //Get a post by Slug
  getPost(slug: string) {
    const url = 'api/posts/post/' + slug;
    return this.http.get<Post>(url);
  }

  //Add a post
  addPosts(title: string, content: string, image: any[], category: string, tags: string[]){
    let url = 'api/posts/post/';

    const post: Post = {title: title, content: content, image: image, category: category, tags: tags};

    this.http.post(url, post)
    .subscribe(responseData => {
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
    });
  }

  //Add a post
  updatePost(title: string, content: string, image: any[], category: string, tags: string[], slug: string){
    let url = `api/posts/post/${slug}/`

    const post: Post = {'title': title, 'content': content, 'image': image, 'category': category, 'tags': tags};

    console.log(post);
    this.http.put(url, post)
    .subscribe(responseData => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.slug === post.slug);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
    }, error => {
      console.log(error);
    },);
  }

  getPostsUpdateListener(){
    return this.postsUpdate.asObservable();
  }
}
