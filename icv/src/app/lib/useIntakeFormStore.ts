import { NewClient} from '@/types/client-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type State = {
    form: Partial<NewClient>
    progress: {
        clientProfile: string;
        family: string;
        background: string;
        services: string;
        confirmation: string;
    };
 }
 
 
 export type Actions = {
    updateForm: (form: Partial<NewClient>) => void
    clearForm: () => void
    updateProgress: (newProgress: Partial<State['progress']>) => void;
 }
 
 
 export const useIntakeFormStore = create<State & Actions>()(
    persist(
        (set) => ({
            form: {},
            progress: {
                clientProfile: 'not-started',
                family: 'not-started',
                background: 'not-started',
                services: 'not-started',
                confirmation: 'not-started',
            },
            updateForm: (form) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            clearForm: () => set({ form: {} }),
            updateProgress: (newProgress) =>
                set((state) => ({
                    progress: { ...state.progress, ...newProgress },
                })),
        }),
        {
            name: 'new-intake-form-storage',
        },
    ),
 )
 