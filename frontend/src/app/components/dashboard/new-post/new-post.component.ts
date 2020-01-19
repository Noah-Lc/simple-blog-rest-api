import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { Category } from 'src/app/models/category.model';
import { TagService } from 'src/app/services/tag.service';
import { CategoryService } from 'src/app/services/category.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';

class ImageSnippet {
  pending = false;
  status = 'Init';
  name = 'No Image chosen';

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit, OnDestroy {
  tags: Tag[] = [];
  private tagSubscribe: Subscription;

  categories: Category[] = [];
  private categorySubscribe: Subscription;

  newTags: Tag[] = [];
  filterTag: string;

  @ViewChild('tagInput', {static: false} ) tagInputRef: ElementRef;
  form: any;
  selectedFile: ImageSnippet;

  constructor(public tagService: TagService, public categoryService: CategoryService, public postService: PostService) { }

  ngOnInit() {
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
  }

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent): void {
    let inputValue: string = this.tagInputRef.nativeElement.value;

    if (event.code === 'Backspace' && !this.filterTag) {
      this.filterTag = inputValue;
      this.removeTag();
    } else {
      this.filterTag = inputValue;
      if (event.code === 'Comma' || event.code === 'Space') {
        if (inputValue[inputValue.length - 1] === ',' || inputValue[inputValue.length - 1] === ' ') {
          inputValue = inputValue.slice(0, -1);
        }
        const newTag: Tag = this.tags.find(t => t.name === inputValue);
        this.addTag(newTag);
      }
    }
  }

  addTag(tag: Tag): void {
    const exist: Tag = this.newTags.find(t => t === tag);
    if (tag && !exist) {
      this.newTags.push(tag);
      this.tagInputRef.nativeElement.value = '';
      this.filterTag = '';
    }
  }

  removeTag(tag?: Tag): void {
    if (tag) {
      this.newTags = this.newTags.filter(t => t !== tag);
    } else {
      this.newTags.splice(-1);
    }
  }


  onAddPost(postForm: NgForm) {
    if (postForm.invalid) { return; }

    this.postService.addPosts(postForm.value.title, postForm.value.content, this.selectedFile.src, postForm.value.category, this.newTags.map(t => t.id));
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    if (file === undefined) { return; }

    const mimeType = file.type;
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

  ngOnDestroy() {
    this.tagSubscribe.unsubscribe();
    this.categorySubscribe.unsubscribe();
  }
}
