import React, { useState } from 'react'
import Banner from '../components/Banner'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaCheckCircle, FaPaperPlane } from 'react-icons/fa'

const ContactUsPage = (props) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <>
      <Banner title={props.title || 'Contact Us'} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Get in <span className="text-green-700">Touch</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have a question, suggestion, or just want to say hello? Fill out the form below 
              and our team will get back to you soon!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaEnvelope className="text-2xl text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">Send us an email anytime</p>
                <a href="mailto:info@brewbox.com" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                  info@brewbox.com
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaPhone className="text-2xl text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">Mon - Fri, 9am - 6pm</p>
                <a href="tel:+9779812345678" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                  +977 98XXXXXXXX
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaMapMarkerAlt className="text-2xl text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  Kathmandu, Nepal
                </p>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6 sm:p-8 border border-green-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="Facebook"
                  >
                    <FaFacebookF />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 rounded-full bg-green-700 hover:bg-green-800 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaCheckCircle className="text-4xl text-green-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h2>
                    <p className="text-lg text-gray-600 mb-6">
                      We've received your message and will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="name">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2" htmlFor="message">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <FaPaperPlane />
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactUsPage
