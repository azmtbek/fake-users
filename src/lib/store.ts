import { Person } from '@/app/data-maker';
import { create } from 'zustand';

export interface DataState {
  data: Person[];
  setData: (data: Person[]) => void;
}

export const useDataStore = create<DataState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  // removeData: () => set({ data: [] }),
}));
// export const type = ReturnType<useDataStore>;