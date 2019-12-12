import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';

import { Tag } from '../../../models/tag.model';
import { TagService } from '../../../services/tag.service';

import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

import { pull } from 'lodash';
import { ModalService } from 'src/app/services/model.service';


class ImageSnippet {
  pending = false;
  status = 'Init';
  name = 'No Image chosen';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', './../dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedFile: ImageSnippet;
  post: Post;
  newTags: Tag[] = [];

  posts: Post[] = [];
  private postSubscribe: Subscription;

  tags: Tag[] = [];
  private tagSubscribe: Subscription;

  categories: Category[] = [];
  private categorySubscribe: Subscription;

  @ViewChild('tagInput', {static: false} ) tagInputRef: ElementRef;
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
    const newTag = this.tags.find(t => t.name == tag);
    if (newTag) {
      this.newTags.push(newTag);
    }
  }

  removeTag(tag?: string): void {
    if (!!tag) {
      pull(this.newTags, tag);
    } else {
      this.newTags.splice(-1);
    }
  }

  constructor(private fb: FormBuilder, public postService: PostService, public tagService: TagService, public categoryService: CategoryService, private modalService: ModalService) {}

  ngOnInit() {
    this.form = this.fb.group({
      tag: [undefined],
    });
    this.tagService.getTags();
    this.tagSubscribe = this.tagService.getTagUpdateListener()
      .subscribe((tags: Tag[]) => {
        this.tags = tags;
      });

    this.categoryService.getCategories();
    this.categorySubscribe = this.categoryService.getCategoryUpdateListener()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });

    this.postService.getPosts();
    this.postSubscribe = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) { return; }

    console.log(postForm.value);
    this.postService.addPosts(postForm.value.title, postForm.value.content, this.selectedFile.src, postForm.value.category, this.newTags.map(t => t.id));
    this.closeModal('editPost');
  }

  onUpdatePost(postForm: NgForm) {
    if (postForm.invalid) { return; }

    let image;
    if (this.selectedFile) {
       image = this.selectedFile.src;
    }
    this.postService.updatePost(postForm.value.title, postForm.value.content, image, postForm.value.category, this.newTags.map(t => t.id), this.post.slug);
    this.closeModal('newPost');
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    if (file == undefined) { return; }

    let mimeType = file.type;
    if (mimeType.match(/image\/*/) == null) {
      alert('Only images are supported.');
      return;
    }

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.selectedFile.pending = true;
      this.selectedFile.name = file.name;
    });

    reader.readAsDataURL(file);
  }

  openEditModel(slug: string) {
    this.postService.getPost(slug)
    .subscribe((postData) => {
      this.post = postData;
      this.newTags = this.tags.filter(function (item) {
        return postData.tags.indexOf(item.id) !== -1;
      }); ;
      this.modalService.open('editPost');
    });
  }

  openNewModel() {
    this.newTags = [];
    this.modalService.open('newPost');
  }

  closeModal(modal: string) {
    this.modalService.close(modal);
  }

  ngOnDestroy() {
    this.postSubscribe.unsubscribe();
    this.tagSubscribe.unsubscribe();
    this.categorySubscribe.unsubscribe();
  }
}
