'use client'

import { createDog } from '@/api/examples/examples'
import { Dog, DogSchema } from '@/types/example-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const page = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Dog>({
        resolver: zodResolver(DogSchema),
    })

    const onSubmit = (data: Dog) => {
        console.log(data, 'createDog')
        createDog(data)
    }

    console.log(errors)

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
            <h1>Create a Dog!</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 rounded-md bg-slate-200 p-4"
            >
                <label className="meow" htmlFor="name">
                    Name
                </label>
                <input className="meow" id="name" {...register('name')} />
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
        </div>
    )
}

export default page
