import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.css']
})
export class TagsInputComponent implements OnInit, OnDestroy {
  @ViewChild('tagInput', {static: false} ) tagInputRef: ElementRef;
  @Input() tags: Tag[];
  @Output() currentTags = new EventEmitter<number[]>();

  filterTag: string;
  customTags: Tag[] = [];
  availableTags: Tag[] = [];
  private tagSubscribe: Subscription;

  constructor(public tagService: TagService) { }

  ngOnInit() {
    this.tagService.getTags();
    this.tagSubscribe = this.tagService.getTagUpdateListener()
      .subscribe((tags: Tag[]) => {
        this.availableTags = tags;
      });
    if (this.tags) {
      this.customTags = this.tags;
    }
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
        const newTag: Tag = this.availableTags.find(t => t.name === inputValue);
        this.addTag(newTag);
      }
    }
  }

  addTag(tag: Tag): void {
    const exist: Tag = this.customTags.find(t => t === tag);
    if (tag && !exist) {
      this.customTags.push(tag);
      this.currentTags.emit(this.customTags.map(t => t.id));
      this.tagInputRef.nativeElement.value = '';
      this.filterTag = '';
    }
  }

  removeTag(tag?: Tag): void {
    if (tag) {
      this.customTags = this.customTags.filter(t => t !== tag);
    } else {
      this.customTags.splice(-1);
    }
    this.currentTags.emit(this.customTags.map(t => t.id));
  }

  ngOnDestroy() {
    this.tagSubscribe.unsubscribe();
  }
}
