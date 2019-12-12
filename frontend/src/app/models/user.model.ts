export interface User {
  pk?: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
}
