import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Config } from '../../config/configuration.config'
import { Post } from '../models/post.model';

@Injectable({providedIn: 'root'})
export class PostService{
  private posts: Post[] = [];
  private postsUpdate = new Subject<Post[]>();
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private strUrl = Config.URL;

  constructor(private http: HttpClient) { }

  //Get all bolgs
  getPosts(){
    let url = this.strUrl + 'posts/post/';
    this.http.get<Post[]>(url)
    .subscribe((postData) => {
      this.posts = postData;
      this.postsUpdate.next([...this.posts]);
    });
  }

  //Get a blog by ID
  getBlog(id: Number) {
    const url = this.strUrl + 'posts/post/' + id;
    /*return this.http.get(url)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);*/
  }

  addPosts(title: string, content: string){
    let url = this.strUrl + 'posts/post/';
    const post: Post = {id:null, user:null, title:title, content:content, image: "", link:"", category:"", tags:"", created_at:null, updated_at:null};
    /*this.http.post(url, post)
    .subscribe(responseData => {
      console.log(responseData);
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);
    });*/
  }

  getPostUpdateListener(){
    return this.postsUpdate.asObservable();
  }
}
