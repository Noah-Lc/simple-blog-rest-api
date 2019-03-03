import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Category } from '../models/category.model'
import { CategoryService } from '../services/category.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
  categories: Category[] = [];
  private categorySubscribe: Subscription;

  constructor(public categoryService: CategoryService){}

  ngOnInit(){
    this.categoryService.getCategories();
    this.categorySubscribe = this.categoryService.getCategoryUpdateListener()
      .subscribe((categories: Category[]) =>{
        this.categories = categories;
      });
  }

  ngOnDestroy(){
    this.categorySubscribe.unsubscribe();
  }
}
