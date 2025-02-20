'use client'

import { FamilySchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useNewIntake } from '../../lib/useNewIntake'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, updateForm } = useNewIntake()
    type FamilyType = TypeOf<typeof FamilySchema>

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FamilyType>({
        mode: 'onChange',
        resolver: zodResolver(FamilySchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    useEffect(() => {
        reset(loadedForm)
    }, [loadedForm, reset])

    useEffect(() => {
        const unsubscribe = watch((data) => {
            updateForm(data)
        }).unsubscribe
        console.log(loadedForm)
        console.log(errors)

        return unsubscribe
    }, [watch, loadedForm])

    const onSubmit = (data: FamilyType) => {
        console.log('in submit...', data)
        updateForm(data)
        router.push('/intake/background')
    }

    return (
        <form
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-8">
                <label className="bold text-2xl">Family</label>
                <div className="flex flex-col">
                    <label>Family Size</label>
                    <input
                        {...register('familySize', {
                            valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Text"
                        className="w-[50%] rounded border p-2"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 p-2 text-white"
            >
                Continue
            </button>
        </form>
    )
}

export default Page
