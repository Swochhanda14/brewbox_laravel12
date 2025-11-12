import React from 'react'
import { Link } from 'react-router-dom'
import Banner from '../components/Banner'
import { FaCoffee, FaLeaf, FaHeart, FaGlobe, FaAward, FaUsers } from 'react-icons/fa'

const AboutUsPage = (props) => {
  return (
    <>
      <Banner title={props.title || 'About Us'} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            About <span className="text-green-700">BrewBox</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your go-to destination for premium coffee subscriptions and curated coffee products. 
            We bring the finest beans and blends from around the world directly to your doorstep.
          </p>
        </div>

        {/* Main Image */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="/hero.jpg" 
            alt="BrewBox Coffee" 
            className="w-full h-64 sm:h-96 object-cover" 
          />
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 sm:p-12 mb-12 shadow-lg border border-green-100">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto mb-6">
            At BrewBox, our mission is to bring the finest beans and blends from around the world 
            directly to your doorstep, ensuring every cup is a delightful experience. We believe in 
            quality, sustainability, and supporting local roasters.
          </p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            Whether you are a casual coffee drinker or a passionate aficionado, BrewBox offers 
            flexible subscription plans and a wide selection of products to suit your taste.
          </p>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaCoffee className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Premium Quality</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We source only the finest coffee beans from renowned growers worldwide, ensuring exceptional taste in every cup.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaLeaf className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Sustainability</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Committed to sustainable practices, we support eco-friendly farming and fair trade partnerships.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaHeart className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Passion</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Our love for coffee drives us to continuously explore and share the best coffee experiences with you.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaGlobe className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Global Selection</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Discover unique flavors from coffee regions across the globe, curated by our expert team.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaAward className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Excellence</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                We maintain the highest standards in every aspect, from sourcing to delivery, ensuring excellence.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FaUsers className="text-2xl text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Community</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Building a community of coffee lovers who share their passion and discover new favorites together.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Join the BrewBox Family
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Thank you for choosing BrewBox. Let's brew happiness together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop" 
              className="px-8 py-3 bg-white text-green-800 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Our Products
            </Link>
            <Link 
              to="/subscription" 
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-800 transition-all duration-300 transform hover:scale-105"
            >
              View Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUsPage
