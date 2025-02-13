'use client'

import { Dog, DogSchema } from '@/types/example-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDogFormStore } from '../../lib/useDogFormStore'

interface Props {}

const page = (props: Props) => {
    // get name and updateForm from the store
    const { form: loadedForm, updateForm } = useDogFormStore()

    console.log('loadedForm', loadedForm)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Partial<Dog>>({
        resolver: zodResolver(DogSchema.partial()),
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
        console.log('on submit')
        updateForm(data)
        // go to the next page
        console.log('data', data)
        router.push('/examples/makedog/background')
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 rounded-md bg-slate-200 p-4"
        >
            <label className="meow" htmlFor="name">
                Name
            </label>
            <input className="meow" id="name" {...register('name')} />
            <button type="submit">Next</button>
        </form>
    )
}

export default page
