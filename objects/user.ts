export type Role = 'admin' | 'user' | 'manager';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export type UserListItem = Omit<User, 'password'>