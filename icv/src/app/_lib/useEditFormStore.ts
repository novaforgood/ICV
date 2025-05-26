import { NewClient } from '@/types/client-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  forms: Record<string, Partial<NewClient>>
}

type Actions = {
  getForm: (id: string) => Partial<NewClient>
  setForm: (id: string, form: Partial<NewClient>) => void
  updateForm: (id: string, form: Partial<NewClient>) => void
  clearForm: (id: string) => void
}

export const useEditFormStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      forms: {},

      getForm: (id) => get().forms[id] || {},

      setForm: (id, form) =>
        set((state) => ({
          forms: { ...state.forms, [id]: form },
        })),

      updateForm: (id, form) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [id]: {
              ...state.forms[id],
              ...form,
            },
          },
        })),

      clearForm: (id) =>
        set((state) => {
          const newForms = { ...state.forms }
          delete newForms[id]
          return { forms: newForms }
        }),
    }),
    {
      name: 'client-edit-form-storage',
    },
  ),
)
