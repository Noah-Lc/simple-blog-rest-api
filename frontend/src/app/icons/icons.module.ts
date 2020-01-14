import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Home, User, Feather, Grid, Trash2, Search, Save, Edit, PlusSquare, Paperclip, Eye, EyeOff, Bell } from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {
  Home,
  User,
  Feather,
  Trash2,
  Search,
  Save,
  Edit,
  PlusSquare,
  Paperclip,
  Eye,
  EyeOff,
  Bell,
  Grid
};

@NgModule({
  declarations: [],
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
