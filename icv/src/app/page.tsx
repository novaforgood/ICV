'use client'
import { useState } from 'react'

export default function Home() {
    const [textValue, setTextValue] = useState('')
    const createNewFirebaseDocument = async () => {
        if (!textValue) {
            alert('alert value')
            return
        }
        try {
            const {
                getFirestore,
                collection,
                addDoc,
            } = require('firebase/firestore')
            const db = getFirestore()

            // Replace 'your-collection-name' with your Firebase collection name
            const docRef = await addDoc(collection(db, 'clients'), {
                inputValue: textValue,
                createdAt: new Date(),
            })

            alert(`Document created with ID: ${docRef.id}`)
            setTextValue('') // Clear the input field
        } catch (error) {
            console.error('Error adding document: ', error)
        }
    }
    return (
        <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
            <input
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-4 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            <button onClick={createNewFirebaseDocument}>make doc</button>
            {/* <button onClick={createNewFirebasesDocument}>make doc</button> */}
        </div>
    )
}
