import React from 'react'
import Banner from '../components/Banner'

const AboutUsPage = (props) => {
  return (
    <>
      <Banner title={props.title || 'About Us'} />
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-4 text-green-800">About BrewBox</h1>
      <p className="mb-4 text-gray-700">
        BrewBox is your go-to destination for premium coffee subscriptions and curated coffee products. Our mission is to bring the finest beans and blends from around the world directly to your doorstep, ensuring every cup is a delightful experience.
      </p>
      <p className="mb-4 text-gray-700">
        We believe in quality, sustainability, and supporting local roasters. Whether you are a casual coffee drinker or a passionate aficionado, BrewBox offers flexible subscription plans and a wide selection of products to suit your taste.
      </p>
      <p className="mb-4 text-gray-700">
        Thank you for choosing BrewBox. Let’s brew happiness together!
      </p>
      <div className="mt-6">
        <img src="/hero.jpg" alt="BrewBox Team" className="rounded-lg w-full object-cover max-h-64" />
      </div>
    </div>
    </>
  )
}

export default AboutUsPage
