import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Category } from '../models/category.model';

@Injectable({providedIn: 'root'})
export class CategoryService {
  private categories: Category[] = [];
  private categoriesUpdate = new Subject<Category[]>();

  constructor(private http: HttpClient) { }

  // Get all categories
  getCategories() {
    const url = 'api/posts/categories/';
    this.http.get<Category[]>(url)
    .subscribe((categoryData) => {
      this.categories = categoryData;
      this.categoriesUpdate.next([...this.categories]);
    });
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdate.asObservable();
  }
}
