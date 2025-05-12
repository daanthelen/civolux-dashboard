import type { User } from '@/objects/user';
import { v4 as uuidv4 } from 'uuid';

let users: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    active: true,
    createdAt: new Date(),
    updatedAt: null,
  },
];

export const db = {
  getUsers: (): User[] => {
    return users;
  },

  getUserById: (id: string): User | undefined => {
    const user = users.find(user => user.id === id);
    return user ? user : undefined;
  },

  getUserByCredentials: (
    username: string,
    password: string
  ): User | undefined => {
    const user = users.find(
      user =>
        user.username === username && user.password === password && user.active
    );
    return user ? user : undefined;
  },

  createUser: (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): User => {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: null,
    };

    users.push(newUser);
    return newUser;
  },

  updateUser: (
    id: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): User | undefined => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };

    return users[index];
  },

  deleteUser: (id: string): boolean => {
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    return users.length !== initialLength;
  },
};
