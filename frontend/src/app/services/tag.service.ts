import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Config } from '../../config/configuration.config'
import { Tag } from '../models/tag.model';

@Injectable({providedIn: 'root'})
export class TagService{
  private tags: Tag[] = [];
  private tagsUpdate = new Subject<Tag[]>();
  private strUrl = Config.URL;

  constructor(private http: HttpClient) { }

  //Get all categories
  getTags(){
    let url = this.strUrl + 'posts/tags/';
    this.http.get<Tag[]>(url)
    .subscribe((tagData) => {
      this.tags = tagData;
      this.tagsUpdate.next([...this.tags]);
    });
  }

  //Get a blog by ID
  getTag(id: Number) {
    /*const url = this.strUrl + 'posts/categories/' + id;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);*/
  }

  addTag(title: string, content: string){
    let url = this.strUrl + 'posts/post/';
    /*const post: Post = {title:title, content:content, image: null, link:"", category:"hospital", categories:[1]};
    this.http.post(url, post)
    .subscribe(responseData => {
      console.log(responseData);
      this.categories.push(post);
      this.categoriesUpdate.next([...this.posts]);
    });*/
  }

  getTagUpdateListener(){
    return this.tagsUpdate.asObservable();
  }
}
