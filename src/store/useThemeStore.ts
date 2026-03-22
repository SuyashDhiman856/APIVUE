import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  mode: 'light' | 'dark';
  primaryColor: string;
  setMode: (mode: 'light' | 'dark') => void;
  setPrimaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      primaryColor: '#ec4899', // Pink-500
      setMode: (mode) => {
        document.documentElement.classList.toggle('dark', mode === 'dark');
        set({ mode });
      },
      setPrimaryColor: (color) => {
        document.documentElement.style.setProperty('--primary', color);
        set({ primaryColor: color });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
