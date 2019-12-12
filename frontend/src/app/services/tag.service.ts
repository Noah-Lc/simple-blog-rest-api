import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Tag } from '../models/tag.model';

@Injectable({providedIn: 'root'})
export class TagService {
  private tags: Tag[] = [];
  private tagsUpdate = new Subject<Tag[]>();

  constructor(private http: HttpClient) { }

  // Get all categories
  getTags() {
    const url = 'api/posts/tags/';
    this.http.get<Tag[]>(url)
    .subscribe((tagData) => {
      this.tags = tagData;
      this.tagsUpdate.next([...this.tags]);
    });
  }

  getTagUpdateListener() {
    return this.tagsUpdate.asObservable();
  }
}
