import { NewClient } from '@/types/client-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FormMap = Record<string, Partial<NewClient>>

export type State = {
  forms: FormMap
}

export type Actions = {
  updateForm: (id: string, form: Partial<NewClient>) => void
  setForm: (id: string, form: Partial<NewClient>) => void
  clearForm: (id: string) => void
  getForm: (id: string) => Partial<NewClient>
}

export const useEditFormStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      forms: {},

      setForm: (id, form) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [id]: form,
          },
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
          const updated = { ...state.forms }
          delete updated[id]
          return { forms: updated }
        }),

      getForm: (id) => {
        return get().forms[id] ?? {}
      },
    }),
    {
      name: 'edit-form-storage', // persisted key
    },
  ),
)
