import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div>
      <div className='relative'>
        <img src="/hero.jpg" className='w-full h-60 sm:h-80 md:h-[400px] lg:h-[600px] object-cover' />
        <div className='absolute inset-0 bg-black opacity-30'></div>
        <div className='absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:ml-20 md:p-10 w-full md:w-[60%] lg:w-[40%]'>
          <p className='text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white'>Freshly roasted coffee delivered at your doorstep.</p>
          <Link to='/shop'>
            <button className='bg-green-800 px-4 py-3 text-white font-bold uppercase rounded mt-6 sm:mt-8 hover:cursor-pointer hover:bg-green-900'>Visit Store</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
