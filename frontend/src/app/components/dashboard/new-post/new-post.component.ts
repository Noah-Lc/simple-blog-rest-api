import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { Category } from 'src/app/models/category.model';
import { TagService } from 'src/app/services/tag.service';
import { CategoryService } from 'src/app/services/category.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { ImageSnippet } from 'src/app/models/image.model';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  private categorySubscribe: Subscription;

  postTags: number[];
  filterTag: string;
  imageSrc: string;


  constructor(public categoryService: CategoryService, public postService: PostService) { }

  ngOnInit() {
    this.categoryService.getCategories();
    this.categorySubscribe = this.categoryService.getCategoryUpdateListener()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });
  }

  loadTags(tags: number[]) {
    this.postTags = tags;
  }

  loadImage(image: string) {
    this.imageSrc = image;
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) { return; }

    this.postService.addPosts(postForm.value.title, postForm.value.content, this.imageSrc, postForm.value.category, this.postTags);
    postForm.reset();
  }

  ngOnDestroy() {
    this.categorySubscribe.unsubscribe();
  }
}
