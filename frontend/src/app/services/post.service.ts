import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/post.model';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdate = new Subject<any>();

  constructor(private http: HttpClient) { }

  // Get all posts
  getPosts() {
    const url = 'api/posts/post/';
    this.http.get<Post[]>(url)
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdate.next([...this.posts]);
    });
  }

  // Get feature posts
  getFeaturePosts() {
    const url = 'api/posts/feature/';
    this.http.get<Post[]>(url)
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdate.next([...this.posts]);
    });
  }

  // Get a post by Slug
  getPost(slug: string) {
    const url = 'api/posts/post/' + slug;
    return this.http.get<Post>(url);
  }

  // Add a post
  addPosts(title: string, content: string, image: string, category: string, tags: number[]) {
    const url = 'api/posts/post/';

    const post: Post = {title: title, content: content, image: image, category: category, tags: tags};

    this.http.post(url, post)
    .subscribe(responseData => {
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
    });
  }

  // Update a post
  updatePost(title: string, content: string, image: string, category: string, tags: number[], slug: string) {
    const url = `api/posts/post/${slug}/`;

    const post: Post = {title: title, content: content, image: image, category: category, tags: tags};

    this.http.patch(url, post)
    .subscribe(res => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.slug === post.slug);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
    }, error => {
      console.log(error);
    }, );
  }

  getPostsUpdateListener() {
    return this.postsUpdate.asObservable();
  }
}
