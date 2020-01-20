export class ImageSnippet {
    pending = false;
    status = 'Init';
    name = 'No Image chosen';

    constructor(public src: string, public file: File) {}
}
