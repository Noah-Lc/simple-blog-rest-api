import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'

import { Post } from '../../../models/post.model'
import { PostService } from '../../../services/post.service'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent{

  constructor(public postService: PostService){}

  onAddPost(postForm: NgForm){
    if(postForm.invalid) return;

    this.postService.addPosts(postForm.value.title, postForm.value.content, postForm.value.image, postForm.value.category, postForm.value.tags);
    postForm.resetForm();
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

  }
}
