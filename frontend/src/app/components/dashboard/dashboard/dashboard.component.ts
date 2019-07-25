import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model'
import { PostService } from '../../../services/post.service'

import { Tag } from '../../../models/tag.model'
import { TagService } from '../../../services/tag.service'

import { Category } from '../../../models/category.model'
import { CategoryService } from '../../../services/category.service'


class ImageSnippet {
  pending: boolean = false;
  status: string = 'Init';
  name: string = 'No Image chosen'

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public editModel : boolean = false;
  selectedFile: ImageSnippet;
  post: Post;

  posts: Post[] = [];
  private postSubscribe: Subscription;

  tags: Tag[] = [];
  private tagSubscribe: Subscription;

  categories: Category[] = [];
  private categorySubscribe: Subscription;


  constructor(public postService: PostService, public tagService: TagService, public categoryService: CategoryService){}

  ngOnInit(){
    this.tagService.getTags();
    this.tagSubscribe = this.tagService.getTagUpdateListener()
      .subscribe((tags: Tag[]) =>{
        this.tags = tags;
      });

    this.categoryService.getCategories();
    this.categorySubscribe = this.categoryService.getCategoryUpdateListener()
      .subscribe((categories: Category[]) =>{
        this.categories = categories;
      });

    this.postService.getPosts();
    this.postSubscribe = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) =>{
        this.posts = posts;
      });
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
    this.selectedFile.src = '';
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    if(file == undefined) return;

    var mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported.");
      return;
    }

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      this.selectedFile.name = file.name;

    });

    reader.readAsDataURL(file);
  }

  openModelEdit(id: string){
    this.post = this.posts.find(x => x.id === id);
    this.editModel = true;
  }

  closeModelEdit(){
    this.editModel = false;
  }

  ngOnDestroy(){
    this.postSubscribe.unsubscribe();
    this.tagSubscribe.unsubscribe();
    this.categorySubscribe.unsubscribe();
  }
}
