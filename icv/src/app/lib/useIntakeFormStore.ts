import { NewClient} from '@/types/client-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type State = {
    form: Partial<NewClient>
 }
 
 
 export type Actions = {
    updateForm: (form: Partial<NewClient>) => void
    clearForm: () => void
 }
 
 
 export const useIntakeFormStore = create<State & Actions>()(
    persist(
        (set) => ({
            form: {},
            updateForm: (form) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            clearForm: () => set({ form: {} }),
        }),
        {
            name: 'new-intake-form-storage',
        },
    ),
 )
 