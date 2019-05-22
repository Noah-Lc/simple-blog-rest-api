import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'

import { Post } from '../../../models/post.model'
import { PostService } from '../../../services/post.service'

class ImageSnippet {
  pending: boolean = false;
  status: string = 'Init';
  name: string = 'No Image chosen'

  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html'
})
export class PostCreateComponent{
  selectedFile: ImageSnippet;

  constructor(public postService: PostService){}

  onAddPost(postForm: NgForm){
    if(postForm.invalid) return;

    this.postService.addPosts(postForm.value.title, postForm.value.content, this.selectedFile.src, postForm.value.category, postForm.value.tags);
    postForm.resetForm();
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
}
