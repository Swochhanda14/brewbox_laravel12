import { useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaEnvelope, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success('If that email address exists, we will send a password reset link.');
      setEmail('');
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Banner title="Forgot Password" />
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-6">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors mb-4"
              >
                <FaArrowLeft />
                <span>Back to Login</span>
              </Link>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-green-700 font-semibold hover:text-green-800">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

