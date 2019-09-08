export interface Post{
  id?: string;
  created_by? : string;
  title : string;
  content : string;
  image : any[];
  slug? : string;
  category : string;
  tags : string[];
  created_at? : Date;
}