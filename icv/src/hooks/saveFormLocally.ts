import { useEffect } from 'react'
import { UseFormSetValue, FieldValues, UseFormWatch } from 'react-hook-form'

interface UseLocalStorageFormProps {
    storageKey: string;
    watch: UseFormWatch<FieldValues>;
    setValue: UseFormSetValue<FieldValues>;
}

export function useLocalStorageForm({
    storageKey,
    watch,
    setValue,
}: UseLocalStorageFormProps) {

    useEffect(() => {
        // check if any saved data is available in localStorage
        const savedData = localStorage.getItem(storageKey)
        
        if (savedData) {
            // if data exists, parse and set the relevant form values with 'setValue'
            const parsedData = JSON.parse(savedData)
            Object.keys(parsedData).forEach((key) => {
                setValue(key as any, parsedData[key]) // sets the form field with saved inputs
            })
        }

        // tracks any changes to form fields and updates local storage with it
        const subscription = watch((data) => {
            // form object is saved as string in local storage
            localStorage.setItem(storageKey, JSON.stringify(data))
        })

        // cleanup function: stop tracking form changes upon page reload/remount
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, storageKey, setValue])

}
