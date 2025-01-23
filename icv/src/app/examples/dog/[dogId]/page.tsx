import { getDogById } from '@/api/examples/examples'

const page = async ({
    params,
}: {
    params: {
        dogId: string
    }
}) => {
    const dog = await getDogById(params.dogId)

    return (
        <div>
            <h1>View a Dog</h1>
            <p>Here you can view a dog</p>
            <p>{dog.name}</p>
            <p>{dog.age}</p>
            <p>{dog.breed}</p>
            <p>{dog.isGoodBoy ? 'Good Boy' : 'Bad Boy'}</p>
        </div>
    )
}

export default page
