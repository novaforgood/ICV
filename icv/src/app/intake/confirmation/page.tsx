'use client'

import { createClient } from '@/api/make-cases/make-case'
import { ClientIntakeSchema } from '@/types/client-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { TypeOf } from 'zod'
import { useIntakeFormStore } from '../../lib/useIntakeFormStore'

interface Props {}

const Page = (props: Props) => {
    const { form: loadedForm, clearForm } = useIntakeFormStore()
    type ClientType = TypeOf<typeof ClientIntakeSchema>

    const {
        handleSubmit,
        formState: { errors },
    } = useForm<ClientType>({
        mode: 'onChange',
        resolver: zodResolver(ClientIntakeSchema),
        defaultValues: loadedForm,
    })

    const router = useRouter()

    const onSubmit = (data: ClientType) => {
        console.log('in submit...', data)
        createClient(data)
        clearForm()
        router.push('/intake')
    }

    return (
        <form
            className="space-y-4"
            style={{ padding: '50px' }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="space-y-8">
                <label className="bold text-2xl">Confirmation</label>
            </div>

            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 p-2 text-white"
            >
                Submit
            </button>
        </form>
    )
}

export default Page
