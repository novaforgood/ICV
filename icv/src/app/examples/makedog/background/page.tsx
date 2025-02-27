'use client'

import { Dog, DogSchema } from '@/types/example-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDogFormStore } from '../lib/useDogFormStore'

interface Props {}

const page = (props: Props) => {
    // get name and updateForm from the store
    const { form: loadedForm, updateForm } = useDogFormStore()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<Partial<Dog>>({
        resolver: zodResolver(DogSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm(data)
        }).unsubscribe
        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: Partial<Dog>) => {
        updateForm(data)
        // go to the next page
        router.push('/examples/makedog/notes')
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 rounded-md bg-slate-200 p-4"
        >
            <label className="meow" htmlFor="age">
                Age
            </label>
            <input
                className="meow"
                id="age"
                type="number"
                {...register('age', { valueAsNumber: true })}
            />
            <label className="meow" htmlFor="breed">
                Breed
            </label>
            <input className="meow" id="breed" {...register('breed')} />
            <button type="submit">Next</button>
        </form>
    )
}

export default page
