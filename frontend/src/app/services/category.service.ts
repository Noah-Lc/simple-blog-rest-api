import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'

import { Config } from '../../config/configuration.config'
import { Category } from '../models/category.model';

@Injectable({providedIn: 'root'})
export class CategoryService{
  private categories: Category[] = [];
  private categoriesUpdate = new Subject<Category[]>();
  private strUrl = Config.URL;

  constructor(private http: HttpClient) { }

  //Get all categories
  getCategories(){
    let url = this.strUrl + 'posts/categories/';
    this.http.get<Category[]>(url)
    .subscribe((categoryData) => {
      this.categories = categoryData;
      this.categoriesUpdate.next([...this.categories]);
    });
  }

  //Get a blog by ID
  getCategory(id: Number) {
    /*const url = this.strUrl + 'posts/categories/' + id;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError);*/
  }

  addCategory(title: string, content: string){
    let url = this.strUrl + 'posts/post/';
    /*const post: Post = {title:title, content:content, image: null, link:"", category:"hospital", categories:[1]};
    this.http.post(url, post)
    .subscribe(responseData => {
      console.log(responseData);
      this.categories.push(post);
      this.categoriesUpdate.next([...this.posts]);
    });*/
  }

  getCategoryUpdateListener(){
    return this.categoriesUpdate.asObservable();
  }
}
