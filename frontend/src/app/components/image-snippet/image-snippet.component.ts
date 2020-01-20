import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageSnippet } from 'src/app/models/image.model';

@Component({
  selector: 'app-image-snippet',
  templateUrl: './image-snippet.component.html',
  styleUrls: ['./image-snippet.component.css']
})
export class ImageSnippetComponent {
  @Input() postImage: string;
  @Output() imageSrc = new EventEmitter<string>();

  selectedFile: ImageSnippet;

  constructor() { }

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

      this.imageSrc.emit(this.selectedFile.src);
    });

    reader.readAsDataURL(file);
  }
}
