'use client'

import { useState } from 'react'
import { seedExampleData } from '../actions/seedData'
import { useUser } from '@/hooks/useUser'

export default function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('')
  const { user } = useUser()

  const handleSeedData = async () => {
    if (!user?.uid) {
      setStatus('You must be logged in to seed data')
      return
    }

    try {
      setIsLoading(true)
      setStatus('')
      const result = await seedExampleData(user.uid)

      console.log('result', result)
      
      if (result.success) {
        console.log('Success: ', result.message)
        setStatus(`Success: ${result.message}`)
      } else {
        setStatus(`Error: ${result.message}`)
        console.error('Error seeding data:', result.message)
      }
    } catch (error) {
      console.error('Error seeding example data:', error)
      setStatus('Error: Failed to seed example data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button 
        onClick={handleSeedData} 
        disabled={isLoading || !user?.uid}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Seeding Data...' : 'Seed Example Data'}
      </button>
      {status && <p className={status.includes('Error') ? 'text-red-500' : 'text-green-500'}>{status}</p>}
    </div>
  )
} 