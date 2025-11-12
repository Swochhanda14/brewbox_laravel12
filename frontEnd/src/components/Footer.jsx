// components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-gray-300 mt-20 border-t border-green-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                BrewBox
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Delivering premium coffee to your doorstep. Experience the finest coffee beans from around the world.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FaEnvelope className="text-green-400" />
                <span>info@brewbox.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FaPhone className="text-green-400" />
                <span>+977 98XXXXXXXX</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <FaMapMarkerAlt className="text-green-400" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 pb-2 border-b border-green-700">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/subscription" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Subscription
                </Link>
              </li>
              <li>
                <Link 
                  to="/about-us" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact-us" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 pb-2 border-b border-green-700">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/profile" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  My Account
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Returns
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-sm sm:text-base text-gray-300 hover:text-green-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-5 pb-2 border-b border-green-700">
              Follow Us
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-5">
              Stay connected with us on social media for the latest updates and offers.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-green-800 hover:bg-green-700 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-green-800 hover:bg-green-700 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-full bg-green-800 hover:bg-green-700 flex items-center justify-center text-white text-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-green-800 mt-12 sm:mt-16 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm sm:text-base text-gray-400 text-center sm:text-left">
              &copy; {new Date().getFullYear()} BrewBox. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-green-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-300 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
