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
      }catch(err){
        const msg = err?.data?.message || err?.error || '';
        if (typeof msg === 'string') {
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
        }
        toast.error(msg || "Registration failed");
      }
    }

  return (
    <div>
      <Banner title={props.title} />
      <div className='flex flex-col items-center gap-5 mb-10'>
        <form onSubmit={submitHandler} className='w-full max-w-md mt-10 flex flex-col gap-6 px-4 sm:px-8 md:w-1/2 lg:w-1/3'>
            <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600'  htmlFor="name">Username</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='John Doe' value={name} onChange={(e)=>setName(e.target.value)} required minLength={5} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600'  htmlFor="email">Email</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="email" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} required inputMode="email" />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600'  htmlFor="number">Phone Number</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="tel" placeholder='Enter your phone number' value={number} onChange={(e)=>setPhoneNumber(e.target.value)} required inputMode="numeric" pattern="^98\d{8}$" />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="password">Password</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="confirmPassword">Confirm Password</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Re-enter Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required minLength={8} />
            </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-base sm:text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Sign Up</button>
        </form>
        <div className='text-base sm:text-lg px-4'>
            <p>Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='underline text-green-700'>Login</Link></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
