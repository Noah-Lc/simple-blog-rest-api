import { Tag } from './tag.model';
import { Category } from './category.model';

export interface Post{
  id?: string;
  created_by? : string;
  title : string;
  content : string;
  image : string;
  slug? : string;
  category : string;
  tags : number[];
  created_at? : Date;
}