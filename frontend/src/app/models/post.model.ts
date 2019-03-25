export interface Post{
  id?: string;
  title : string;
  content : string;
  image : string;
  slug? : string;
  category : string[];
  tags : string[];
}
