import {useState, useEffect} from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import Banner from '../components/Banner'
import { useDispatch,useSelector } from 'react-redux'
import { useRegisterMutation } from '../slices/usersApiSlice'
import {setCredentials} from '../slices/authSlice'
import { toast } from 'react-toastify'

const RegisterPage = (props) => {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [number,setPhoneNumber]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register,{isLoading}]= useRegisterMutation();

    const {userInfo} = useSelector((state)=>state.auth);

    const {search}=useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(()=>{
      if(userInfo){
        navigate(redirect);
      }
    },[userInfo,redirect,navigate]);

    const submitHandler= async (e)=>{
      e.preventDefault();

      const trimmedName = name.trim();
      const emailPattern = /^\S+@\S+\.\S+$/;
      const passwordComplexity = /^(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{}_\-+=~`|\\:;"'<>,.?/]).{8,}$/;

      // Username validation rules
      if (trimmedName.length < 5) {
        toast.error("Username must be at least 5 characters");
        return;
      }

      if(password!==confirmPassword){
        toast.error("Password donot match!");
        return;
      }
      // Phone number validation: must be 10 digits and start with 98
      if(!/^98\d{8}$/.test(number)){
        toast.error("Phone number must be 10 digits and start with 98");
        return;
      }
      // Email validation: must be a valid email format
      if(!emailPattern.test(email)){
        toast.error("Please enter a valid email address");
        return;
      }
      // Password complexity
      if(!passwordComplexity.test(password)){
        toast.error("Password must be at least 8 characters, include 1 uppercase letter and 1 symbol");
        return;
      }
      try{
        const res = await register({name: trimmedName,email,password,number}).unwrap();
        dispatch(setCredentials({...res,}));
        navigate(redirect);
        toast.success('Registration successful!');
      }catch(err){
        // Handle Laravel validation errors
        if (err?.data?.errors) {
          const errors = err.data.errors;
          // Check for specific field errors
          if (errors.name && errors.name.length > 0) {
            toast.error(errors.name[0]);
            return;
          }
          if (errors.email && errors.email.length > 0) {
            toast.error(errors.email[0]);
            return;
          }
          if (errors.number && errors.number.length > 0) {
            toast.error(errors.number[0]);
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
          if ((lower.includes('email')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
            toast.error("Email already in use");
            return;
          }
          if ((lower.includes('phone') || lower.includes('number')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
            toast.error("Phone number already in use");
            return;
          }
          if ((lower.includes('username') || lower.includes('name')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
            toast.error("Username already in use");
            return;
          }
          toast.error(msg);
        } else {
          toast.error("Registration failed. Please check your input.");
        }
      }
    }

  return (
    <div>
      <Banner title={props.title} />
      <div className='flex flex-col items-center gap-5 mb-10 pb-10'>
        <form onSubmit={submitHandler} className='w-full max-w-md mt-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 flex flex-col gap-6'>
            <div className="text-center mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm sm:text-base">Join us and start your coffee journey</p>
            </div>
            
            <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-semibold text-gray-700'  htmlFor="name">Username</label>
            <input 
              className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
              type="text" 
              placeholder='John Doe' 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              required 
              minLength={5} 
            />
            </div>
            
            <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-semibold text-gray-700'  htmlFor="email">Email Address</label>
            <input 
              className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
              type="email" 
              placeholder='example@gmail.com' 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              required 
              inputMode="email" 
            />
            </div>
            
            <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-semibold text-gray-700'  htmlFor="number">Phone Number</label>
            <input 
              className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
              type="tel" 
              placeholder='98XXXXXXXX' 
              value={number} 
              onChange={(e)=>setPhoneNumber(e.target.value)} 
              required 
              inputMode="numeric" 
              pattern="^98\d{8}$" 
            />
            </div>
            
            <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-semibold text-gray-700' htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <input
                className='border border-gray-300 rounded-lg px-4 py-3 pr-12 text-base sm:text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter Password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
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
            
            <div className='flex flex-col gap-2'>
            <label className='text-sm sm:text-base font-semibold text-gray-700' htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                className='border border-gray-300 rounded-lg px-4 py-3 pr-12 text-base sm:text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Re-enter Password'
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 text-gray-500 hover:text-green-600 focus:outline-none transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
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
              type='submit' 
              className='py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-base sm:text-lg text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
        
        <div className='text-base sm:text-lg bg-white rounded-lg px-6 py-4 shadow-md border border-gray-100'>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to={redirect ? `/login?redirect=${redirect}` : '/login'} 
                className='font-semibold text-green-700 hover:text-green-800 underline transition-colors'
              >
                Login here
              </Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
