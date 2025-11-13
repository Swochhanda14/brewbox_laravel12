import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Banner from '../components/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(userInfo.isAdmin ? '/admin/dashboard' : redirect);
    }
  }, [userInfo, redirect, navigate]);

  // Login handler
  const submitHandler = async (e) => {
    e.preventDefault();
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    try {
      // Call login mutation
      const res = await login({ email, password }).unwrap();

      // Save credentials in Redux
      dispatch(setCredentials(res));

      // Redirect based on role
      navigate(res.isAdmin ? '/admin/dashboard' : redirect);

      toast.success('Logged in Successfully');
    } catch (err) {
      // Handle Laravel validation errors
      if (err?.data?.errors) {
        const errors = err.data.errors;
        // Check for specific field errors
        if (errors.email && errors.email.length > 0) {
          toast.error(errors.email[0]);
          return;
        }
        if (errors.password && errors.password.length > 0) {
          toast.error(errors.password[0]);
          return;
        }
        // If there are other errors, show the first one
        const firstError = Object.values(errors)[0];
        if (firstError && firstError.length > 0) {
          toast.error(firstError[0]);
          return;
        }
      }
      
      // Handle general error messages
      const msg = err?.data?.message || err?.error || '';
      if (typeof msg === 'string' && msg.trim()) {
        const lower = msg.toLowerCase();
        if (
          lower.includes('invalid') ||
          lower.includes('incorrect') ||
          lower.includes('unauthorized')
        ) {
          toast.error('Incorrect email or password');
          return;
        }
        toast.error(msg);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div>
      <Banner title={props.title} />
      <div className="flex flex-col items-center gap-5 px-4 sm:px-0 pb-10">
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 flex flex-col gap-6"
        >
          <div className="text-center mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm sm:text-base">Sign in to your account</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base font-semibold text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              className="border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              inputMode="email"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm sm:text-base font-semibold text-gray-700" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-green-700 hover:text-green-800 font-semibold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12 text-base sm:text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-gray-500 hover:text-green-600 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18M10.477 10.477A3 3 0 0115 12m5.005-.002a11.958 11.958 0 01-1.41 2.204 11.973 11.973 0 01-1.884 1.977l-3.102-3.102a3 3 0 00-4.243-4.243L7.142 6.293a11.973 11.973 0 012.106-1.77A11.944 11.944 0 0112 4c2.598 0 4.985.83 6.995 2.235a12.027 12.027 0 012.01 1.872 11.96 11.96 0 011.41 2.891 11.965 11.965 0 01-1.41 2.891 12.027 12.027 0 01-1.41 1.872" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.251.806-.582 1.58-.984 2.304M15 12a3 3 0 11-6 0 3 3 0 016 0zM4.951 16.476A11.954 11.954 0 0112 19c2.263 0 4.377-.63 6.181-1.724" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-base sm:text-lg text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="text-base sm:text-lg bg-white rounded-lg px-6 py-4 shadow-md border border-gray-100">
          <p className="text-gray-600">
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="font-semibold text-green-700 hover:text-green-800 underline transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
