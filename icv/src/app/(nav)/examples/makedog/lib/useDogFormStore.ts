import { Dog } from '@/types/example-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type State = {
    form: Partial<Dog>
}

export type Actions = {
    updateForm: (form: Partial<Dog>) => void
    clearForm: () => void
}

export const useDogFormStore = create<State & Actions>()(
    persist(
        (set) => ({
            form: {},
            updateForm: (form) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            clearForm: () => set({ form: {} }),
        }),
        {
            name: 'dog-form-storage',
        },
    ),
)
