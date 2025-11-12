import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='relative'>
      <div className='relative overflow-hidden'>
        <img 
          src="/hero.jpg" 
          className='w-full h-64 sm:h-80 md:h-[450px] lg:h-[600px] xl:h-[700px] object-cover' 
          alt="Fresh Coffee"
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20'></div>
        <div className='absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 w-full md:w-[70%] lg:w-[55%] xl:w-[50%]'>
          <div className='space-y-4 sm:space-y-6'>
            <p className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight drop-shadow-lg'>
              Freshly roasted coffee delivered at your <span className='text-green-400'>doorstep</span>.
            </p>
            <p className='text-base sm:text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed drop-shadow-md'>
              Discover premium coffee beans from around the world. Experience the perfect cup every morning.
            </p>
            <Link to='/shop' className='inline-block mt-4 sm:mt-6'>
              <button className='group bg-gradient-to-r from-green-700 to-green-800 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center gap-2'>
                Visit Store
                <FaArrowRight className='group-hover:translate-x-1 transition-transform duration-300' />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
