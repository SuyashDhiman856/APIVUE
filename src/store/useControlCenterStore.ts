import { create } from 'zustand';

interface ControlCenterState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useControlCenterStore = create<ControlCenterState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
