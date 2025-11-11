import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TopRated from '../components/TopRated.jsx'
import Recommended from '../components/Recommended'

const HomePage = () => {
  
  return (
    <div className='h-full'>
      <Hero />
      <div className='mt-10 sm:mt-16 px-4 sm:px-8 md:px-14'>
        <div className='bg-white border border-green-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <p className='text-sm uppercase tracking-wide text-green-600 font-semibold'>Subscription Highlight</p>
            <h2 className='text-2xl sm:text-3xl font-bold text-green-800 mt-1'>Fresh beans on repeat</h2>
            <p className='text-gray-600 mt-2 max-w-2xl'>
              Join our BrewBox subscription to get freshly roasted coffee delivered at the perfect cadence. Choose your roast, grind, and frequency—pause or switch anytime.
            </p>
          </div>
          <Link
            to="/subscription"
            className="inline-flex items-center justify-center bg-green-700 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-green-800"
          >
            View Subscription Plans
          </Link>
        </div>
      </div>
      <div className='mt-20'>
        {/* <ProductCarousel /> */}
        <TopRated />
      </div>
      <div className='mt-20'>
        {/* pass userId only if available */}
        <Recommended />
      </div>
    </div>
  )
}

export default HomePage
