
import Image from 'next/image'
import ProfileNav from './profilenav';

export default function page() {
return(
    <div className='flex flex-col items-start'>
      <div className=' sticky top-0 left-0 flex flex-col items-start w-full rounded-md border-b  bg-white'>
      <div className='flex flex-row w-full px-10 '>
        <div className="mr-8 pt-4">
          <Image
            src="/icv.png"
            alt="ICV Logo"
            width={150}
            height={150}
            priority
            className="rounded-full"
          />

          
        </div>
        <div className="flex flex-col sticky top-0 w-full pt-8 ">
          <h1 className='text-5xl font-bold'>Client: Jimin Kim</h1>
          <p className='text-m text-gray-600 pt-2'>PK2025</p>
          <p className='text-m text-gray-600'>Housing</p>
       </div>
      </div>
      <ProfileNav/>
      </div>
      
      

      <div className='ml-8 p-10'>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
        <p className='text-5xl'> bruhhhhfrwfjonahrwgbhah</p>
      </div>
    </div>
);
}