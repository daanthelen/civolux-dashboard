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
  getUsers: async (): Promise<User[]> => {
    return users;
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    const user = users.find(user => user.id === id);
    return user ? user : undefined;
  },

  getUserByCredentials: async (
    username: string,
    password: string
  ): Promise<User | undefined> => {
    const user = users.find(
      user =>
        user.username === username && user.password === password && user.active
    );
    return user ? user : undefined;
  },

  createUser: async (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> => {
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date(),
      updatedAt: null,
    };

    users.push(newUser);
    return newUser;
  },

  updateUser: async (
    id: string,
    userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<User | undefined> => {
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return undefined;

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date(),
    };

    return users[index];
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const initialLength = users.length;
    users = users.filter(user => user.id !== id);
    return users.length !== initialLength;
  },
};
