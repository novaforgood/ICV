'use client'

import { createDog } from '@/api/examples/examples'
import { Dog, DogSchema } from '@/types/example-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDogFormStore } from '../lib/useDogFormStore'

interface Props {}

const page = (props: Props) => {
    // get name and updateForm from the store
    const { form: loadedForm, updateForm, clearForm } = useDogFormStore()

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<Dog>({
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

    const onSubmit = async (data: Dog) => {
        const newDogId = await createDog(data)
        clearForm()
        router.push(`/examples/dog/${newDogId}`)
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 rounded-md bg-slate-200 p-4"
        >
            <label className="meow" htmlFor="isGoodBoy">
                Is Good Boy?
            </label>
            <input
                className="meow"
                id="isGoodBoy"
                type="checkbox"
                {...register('isGoodBoy')}
            />
            <button type="submit">Submit</button>
        </form>
    )
}

export default page
