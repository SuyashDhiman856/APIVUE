import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface MockUser extends User {
  password?: string;
}

interface UserState {
  users: MockUser[];
  addUser: (user: MockUser) => void;
  findUser: (email: string) => MockUser | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: 'u1',
          name: 'Alex Developer',
          email: 'alex@example.com',
          role: 'user',
          password: 'password123'
        },
        {
          id: 'o1',
          name: 'MeteorLogic Inc.',
          email: 'org@example.com',
          role: 'org',
          password: 'password123'
        }
      ],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      findUser: (email) => get().users.find((u) => u.email === email),
    }),
    {
      name: 'apivue-users-storage',
    }
  )
);
