import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import TopRated from '../components/TopRated.jsx'
import Recommended from '../components/Recommended'
import { FaArrowRight, FaCoffee, FaLeaf, FaAward, FaHeart } from 'react-icons/fa'

const HomePage = () => {
  
  return (
    <div className='h-full bg-gradient-to-b from-white to-gray-50'>
      <Hero />
      
      {/* Subscription Highlight Section */}
      <div className='mt-12 sm:mt-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='bg-gradient-to-br from-green-50 via-white to-green-50 border-2 border-green-200 rounded-2xl p-8 sm:p-10 md:p-12 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 hover:shadow-2xl transition-shadow duration-300'>
            <div className='flex-1'>
              <p className='text-sm uppercase tracking-wider text-green-700 font-bold mb-2'>Subscription Highlight</p>
              <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4'>
                Fresh beans on <span className='text-green-700'>repeat</span>
              </h2>
              <p className='text-base sm:text-lg text-gray-600 mt-4 max-w-2xl leading-relaxed'>
                Join our BrewBox subscription to get freshly roasted coffee delivered at the perfect cadence. 
                Choose your roast, grind, and frequency—pause or switch anytime.
              </p>
            </div>
            <Link
              to="/subscription"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-green-800 text-white px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View Subscription Plans
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='mt-16 sm:mt-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-800 mb-4'>
              Why Choose <span className='text-green-700'>BrewBox</span>
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Experience the difference with our premium coffee selection and exceptional service
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8'>
            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <FaCoffee className='text-2xl text-green-700' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3 text-center'>Premium Quality</h3>
              <p className='text-gray-600 text-center text-sm leading-relaxed'>
                Hand-selected beans from the world's finest coffee regions
              </p>
            </div>

            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <FaLeaf className='text-2xl text-green-700' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3 text-center'>Eco-Friendly</h3>
              <p className='text-gray-600 text-center text-sm leading-relaxed'>
                Sustainable sourcing and environmentally conscious packaging
              </p>
            </div>

            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <FaAward className='text-2xl text-green-700' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3 text-center'>Expert Curation</h3>
              <p className='text-gray-600 text-center text-sm leading-relaxed'>
                Carefully selected by our coffee experts for the perfect taste
              </p>
            </div>

            <div className='bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto'>
                <FaHeart className='text-2xl text-green-700' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-3 text-center'>Customer First</h3>
              <p className='text-gray-600 text-center text-sm leading-relaxed'>
                Dedicated support and satisfaction guaranteed on every order
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Rated Section */}
      <div className='mt-20 sm:mt-24'>
        <TopRated />
      </div>

      {/* Recommended Section */}
      <div className='mt-20 sm:mt-24'>
        <Recommended />
      </div>
    </div>
  )
}

export default HomePage
