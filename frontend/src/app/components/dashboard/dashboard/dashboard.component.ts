import { Component, OnInit, OnDestroy ,ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms'
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model'
import { PostService } from '../../../services/post.service'

import { Tag } from '../../../models/tag.model'
import { TagService } from '../../../services/tag.service'

import { Category } from '../../../models/category.model'
import { CategoryService } from '../../../services/category.service'

import { find, get, pull } from 'lodash';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'Init';
  name: string = 'No Image chosen'

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  editModel : boolean = false;
  newModel : boolean = false;
  selectedFile: ImageSnippet;
  post: Post;

  posts: Post[] = [];
  private postSubscribe: Subscription;

  tags: Tag[] = [];
  private tagSubscribe: Subscription;

  categories: Category[] = [];
  private categorySubscribe: Subscription;

  @ViewChild('tagInput',{static: false} ) tagInputRef: ElementRef;
  form: FormGroup;

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    const inputValue: string = this.form.controls.tag.value;
    if (event.code === 'Backspace' && !inputValue) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space') {
        this.addTag(inputValue);
        this.form.controls.tag.setValue('');
      }
    }
  }

  addTag(tag: string): void {
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    /*if (tag > 0 && !find(this.post.tags, tag)) {
      this.post.tags.push(tag);
    }*/
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.post.tags, tag);
    } else {
      this.post.tags.splice(-1);
    }
  }


  constructor(private fb: FormBuilder, public postService: PostService, public tagService: TagService, public categoryService: CategoryService){}

  ngOnInit(){
    this.form = this.fb.group({
      tag: [undefined],
    });
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

  onAddPost(postForm: NgForm){
    if(postForm.invalid) return;

    this.postService.addPosts(postForm.value.title, postForm.value.content, this.selectedFile.file, postForm.value.category, postForm.value.tags.split(','));
    this.closeNewModel();
  }

  onUpdatePost(postForm: NgForm){
    if(postForm.invalid) return;

    this.postService.updatePost(postForm.value.title, postForm.value.content, this.selectedFile.file, postForm.value.category, postForm.value.tags, postForm.value.slug);
    this.closeEditModel();
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

  openEditModel(slug: string){
    this.postService.getPost(slug)
    .subscribe((postData) => {
      this.post = postData;
    });
    this.editModel = true;
  }

  openNewModel(){
    this.newModel = true;
  }

  closeEditModel(){
    this.editModel = false;
  }

  closeNewModel(){
    this.newModel = false;
  }

  ngOnDestroy(){
    this.postSubscribe.unsubscribe();
    this.tagSubscribe.unsubscribe();
    this.categorySubscribe.unsubscribe();
  }
}
